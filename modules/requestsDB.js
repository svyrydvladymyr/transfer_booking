const con = require('../db/connectToDB').con;
const {checOnTrueVal, autorisationCheck, tableRecord, token, log} = require('../modules/service');
var url  = require('url');

const townadd = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        let resMess, sql;
        if (req.body.param === 'townAdd') {
            resMess = 'Town added!';
            sql = `INSERT INTO points (town_id, name_ua, name_en, name_ru) 
            VALUES ('${checOnTrueVal(req.body.id)}', 
                    '${checOnTrueVal(req.body.ua)}', 
                    '${checOnTrueVal(req.body.en)}', 
                    '${checOnTrueVal(req.body.ru)}')`; 
        };
        if (req.body.param === 'townEdit') {
            resMess = 'Town edited!';
            sql = `UPDATE points SET name_ua='${checOnTrueVal(req.body.ua)}', name_en='${checOnTrueVal(req.body.en)}', name_ru='${checOnTrueVal(req.body.ru)}' 
            WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
        };
        if (req.body.param === 'townDel') {
            resMess = 'Town deleted!';
            sql = `DELETE FROM points WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
        };
        await tableRecord(sql)
        .then((result) => {
            // console.log('result', result);
            if (result.err && result.err.code == 'ER_DUP_ENTRY') {
                const arr = [req.body.id, req.body.ua, req.body.en, req.body.ru];
                for (let i = 0; i < arr.length; i++) {
                    if (result.err.sqlMessage.includes(arr[i])) {
                        res.send({"DUP": arr[i]}); break;
                    };
                };                
            };
            if (result.err && result.err.code !== 'ER_DUP_ENTRY') { throw new Error('error-DB') };
            if (!result.err) { res.send({"res": resMess}) };               
        });
    })
    .catch((err) => {
        log('towns-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const transferadd = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        let resMess, sql;
        if (req.body.param === 'transferAdd') {
            resMess = 'Transfer added!';
            sql = `INSERT INTO transfers (transfer_id, transfer_from, transfer_to, price_pr, price_gr) 
            VALUES ('${token(15)}'
                    '${checOnTrueVal(req.body.id)}', 
                    '${checOnTrueVal(req.body.ua)}', 
                    '${checOnTrueVal(req.body.en)}', 
                    '${checOnTrueVal(req.body.ru)}')`; 
        };
        if (req.body.param === 'transferEdit') {
            resMess = 'Transfer edited!';
            sql = `UPDATE transfers SET name_ua='${checOnTrueVal(req.body.ua)}', name_en='${checOnTrueVal(req.body.en)}', name_ru='${checOnTrueVal(req.body.ru)}' 
            WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
        };
        if (req.body.param === 'transferDel') {
            resMess = 'Transfer deleted!';
            sql = `DELETE FROM transfers WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
        };
        await tableRecord(sql)
        .then((result) => {

            console.log('result', result);

            if (result.err) { throw new Error('error-DB') };
            if (!result.err) { res.send({"res": resMess}) };               
        });
    })
    .catch((err) => {
        log('transfers-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const townlist = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        await tableRecord(`SELECT * FROM points`)
        .then((result) => {
            if (result.err) { throw new Error('error-DB') };
            res.send({"res": result});
        }); 
    })
    .catch((err) => {
        log('towns-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const transferlist = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        await tableRecord(`SELECT * FROM transfers`)
        .then((result) => {
            if (result.err) { throw new Error('error-DB') };
            res.send({"res": result});
        }); 
    })
    .catch((err) => {
        log('transfers-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

module.exports = {
    townadd,
    transferadd,
    townlist,
    transferlist
}