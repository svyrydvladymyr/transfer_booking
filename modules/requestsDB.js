const con = require('../db/connectToDB').con;
const {checOnTrueVal, autorisationCheck, tableRecord, token, log} = require('../modules/service');
// const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'] : 'uk-UA';

const townadd = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        let resMess, sql;
        if (req.body.param === 'townAdd') {
            resMess = 'Town added!';
            sql = `INSERT INTO points (town_id, name_uk, name_en, name_ru) 
            VALUES ('${checOnTrueVal(req.body.id)}', 
                    '${checOnTrueVal(req.body.ua)}', 
                    '${checOnTrueVal(req.body.en)}', 
                    '${checOnTrueVal(req.body.ru)}')`; 
        };
        if (req.body.param === 'townEdit') {
            resMess = 'Town edited!';
            sql = `UPDATE points SET name_uk='${checOnTrueVal(req.body.ua)}', name_en='${checOnTrueVal(req.body.en)}', name_ru='${checOnTrueVal(req.body.ru)}' 
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
                const arr = [req.body.id, req.body.uk, req.body.en, req.body.ru];
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
    const timeArr = {'time1' : '', 'time2' : '', 'time3' : '', 'time4' : '', 'time5' : '', 'time6' : '', 'time7' : '', 'time8' : '', 'time9' : '', 'time10' : ''};
    if (req.body.param !== 'transferDel') { req.body.times.forEach((element, index) => { timeArr[`time${index + 1}`] = element })};
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        let resMess, sql;
        if (req.body.param === 'transferAdd') {
            resMess = 'Transfer added!';
            sql = `INSERT INTO transfers (transfer_id, transfer_from, transfer_to, price_pr, price_gr, time1, time2, time3, time4, time5, time6, time7, time8, time9, time10, selection) 
            VALUES ('${token(10)}',
                    '${checOnTrueVal(req.body.from)}', 
                    '${checOnTrueVal(req.body.to)}', 
                    '${req.body.pr.replace(new RegExp("[^0-9]", "gi"), '')}', 
                    '${req.body.gr.replace(new RegExp("[^0-9]", "gi"), '')}',
                    '${timeArr.time1}',
                    '${timeArr.time2}',
                    '${timeArr.time3}',
                    '${timeArr.time4}',
                    '${timeArr.time5}',
                    '${timeArr.time6}',
                    '${timeArr.time7}',
                    '${timeArr.time8}',
                    '${timeArr.time9}',
                    '${timeArr.time10}',
                    '${req.body.select === true || req.body.select === false ? req.body.select : false}')`; 
        };
        if (req.body.param === 'transferEdit') {
            resMess = 'Transfer edited!';
            sql = `UPDATE transfers 
            SET transfer_from='${checOnTrueVal(req.body.from)}', 
                transfer_to='${checOnTrueVal(req.body.to)}',  
                price_pr='${req.body.pr.replace(new RegExp("[^0-9]", "gi"), '')}',  
                price_gr='${req.body.gr.replace(new RegExp("[^0-9]", "gi"), '')}',  
                time1='${timeArr.time1}',  
                time2='${timeArr.time2}',  
                time3='${timeArr.time3}',  
                time4='${timeArr.time4}',  
                time5='${timeArr.time5}',  
                time6='${timeArr.time6}',  
                time7='${timeArr.time7}',  
                time8='${timeArr.time8}',  
                time9='${timeArr.time9}',  
                time10='${timeArr.time10}',  
                selection='${req.body.select === true || req.body.select === false ? req.body.select : false}'
            WHERE transfer_id='${checOnTrueVal(req.body.id)}'`; 
        };
        if (req.body.param === 'transferDel') {
            resMess = 'Transfer deleted!';
            sql = `DELETE FROM transfers WHERE transfer_id='${checOnTrueVal(req.body.id)}'`; 
        };
        await tableRecord(sql)
        .then((result) => {
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
    const townsArr = {};
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        await tableRecord(`SELECT town_id, name_uk FROM points`)
        .then((result) => {
            if (result.err) { throw new Error('error-DB') };
            if (!result.err) { result.forEach(element => { townsArr[`${element.town_id}`] = element.name_uk })};
        })
        await tableRecord(`SELECT * FROM transfers`)
        .then((result) => {
            if (result.err) { throw new Error('error-DB') };
            if (!result.err) { 
                const resArr = []; 
                result.forEach(element => {
                    const resEl = {
                        'transfer_id': element.transfer_id,
                        'transfer_from': townsArr[element.transfer_from],
                        'transfer_from_id': element.transfer_from,
                        'transfer_to': townsArr[element.transfer_to],                
                        'transfer_to_id': element.transfer_to,                
                        'price_pr': element.price_pr,                
                        'price_gr': element.price_gr,                
                        'time1': element.time1,                
                        'time2': element.time2,                
                        'time3': element.time3,                
                        'time4': element.time4,                
                        'time5': element.time5,                
                        'time6': element.time6,                
                        'time7': element.time7,                
                        'time8': element.time8,                
                        'time9': element.time9,                
                        'time10': element.time10,                
                        'selection': element.selection,                
                    };
                    resArr.push(resEl);
                });
                res.send({"res": resArr});
            };
        }); 
    })
    .catch((err) => {
        log('transfers-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const variables = async (req, res) => {
    let townsFrom = {}, townsTo = {}, transfersArr = [], townsId = [];
    const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'].slice(0, 2) : 'uk';
    await tableRecord(`SELECT town_id, name_${lang} FROM points`)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-townsID') };
        if (!result.err) { 
            result.forEach(element => { 
                townsId[`${element.town_id}`] = element[`name_${lang}`]
            });
        };
    })
    await tableRecord(`SELECT transfer_from FROM transfers GROUP BY transfer_from`)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-transferFROM') };
        if (!result.err) { 
            result.forEach(element => { 
                townsFrom[`${element.transfer_from}`] = townsId[element.transfer_from];
            });   
        };
    })
    await tableRecord(`SELECT transfer_to FROM transfers GROUP BY transfer_to`)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-transferTO') };
        if (!result.err) { 
            result.forEach(element => { 
                townsTo[`${element.transfer_to}`] = townsId[element.transfer_to];
            });   
        };
    })
    await tableRecord(`SELECT * FROM transfers`)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-transfersARR') };
        if (!result.err) { 
            result.forEach(element => {
                transfersArr.push(element); 
            });           
        };
    })
    .then(() => {
        // console.log('townsId', townsId);
        // console.log('townsFrom', townsFrom);
        // console.log('townsTo', townsTo);
        // console.log('transfersArr', transfersArr);
        res.send({"res": {townsFrom, townsTo, transfersArr}});
    })
    .catch((err) => {
        log('variables-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

module.exports = {
    townadd,
    transferadd,
    townlist,
    transferlist,
    variables
}