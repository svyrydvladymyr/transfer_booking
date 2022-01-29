const con = require('../db/connectToDB').con;
const {checOnTrueVal, autorisationCheck, tableRecord, token, log, readyFullDate} = require('../modules/service');

const townadd = async (req, res) => {
    let resMess;
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };        
        if (req.body.param === 'townAdd') {
            resMess = 'Town added!';
            return `INSERT INTO points (town_id, name_uk, name_en, name_ru) 
            VALUES ('${checOnTrueVal(req.body.id)}', 
                    '${checOnTrueVal(req.body.uk)}', 
                    '${checOnTrueVal(req.body.en)}', 
                    '${checOnTrueVal(req.body.ru)}')`; 
        };
        if (req.body.param === 'townEdit') {
            resMess = 'Town edited!';
            return `UPDATE points SET name_uk='${checOnTrueVal(req.body.uk)}', name_en='${checOnTrueVal(req.body.en)}', name_ru='${checOnTrueVal(req.body.ru)}' 
            WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
        };
        if (req.body.param === 'townDel') {
            resMess = 'Town deleted!';
            return `DELETE FROM points WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
        };
    })
    .then(tableRecord)
    .then(async (result) => {
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
        if (req.body.param !== 'townDel') { res.send({"res": resMess}) };
        if (req.body.param === 'townDel') {
            resMess = 'Town and routes deleted!';
            sql = `DELETE FROM transfers WHERE transfer_from='${checOnTrueVal(req.body.id)}' OR transfer_to='${checOnTrueVal(req.body.id)}'`; 
            await tableRecord(sql)
            .then((result) => {
                if (result.err) { throw new Error('error-DB') };
                res.send({"res": resMess});  
            });
        };               
    })
    .catch((err) => {
        log('towns-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const transferadd = async (req, res) => {
    const timeArr = {'time1' : '', 'time2' : '', 'time3' : '', 'time4' : '', 'time5' : '', 'time6' : '', 'time7' : '', 'time8' : '', 'time9' : '', 'time10' : ''};
    let resMess;
    if (req.body.param !== 'transferDel') { req.body.times.forEach((element, index) => { timeArr[`time${index + 1}`] = element })};
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };        
        if (req.body.param === 'transferAdd') {
            resMess = 'Transfer added!';
            return `INSERT INTO transfers (transfer_id, transfer_from, transfer_to, price_pr, price_gr, time1, time2, time3, time4, time5, time6, time7, time8, time9, time10, selection, privat, microbus) 
            VALUES ('${token(10)}',
                    '${checOnTrueVal(req.body.from)}', 
                    '${checOnTrueVal(req.body.to)}', 
                    '${req.body.pr.replace(new RegExp("[^0-9]", "gi"), '')}', 
                    '${req.body.gr.replace(new RegExp("[^0-9]", "gi"), '')}',
                    '${timeArr.time1.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time2.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time3.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time4.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time5.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time6.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time7.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time8.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time9.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${timeArr.time10.replace(new RegExp("[^0-9:]", "gi"), '')}',
                    '${req.body.select === true ? true : false}', 
                    '${req.body.privat === true ? true : false}', 
                    '${req.body.microbus === true ? true : false}')`; 
        };
        if (req.body.param === 'transferEdit') {
            resMess = 'Transfer edited!';
            return `UPDATE transfers 
            SET transfer_from='${checOnTrueVal(req.body.from)}', 
                transfer_to='${checOnTrueVal(req.body.to)}',  
                price_pr='${req.body.pr.replace(new RegExp("[^0-9]", "gi"), '')}',  
                price_gr='${req.body.gr.replace(new RegExp("[^0-9]", "gi"), '')}',  
                time1='${timeArr.time1.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time2='${timeArr.time2.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time3='${timeArr.time3.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time4='${timeArr.time4.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time5='${timeArr.time5.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time6='${timeArr.time6.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time7='${timeArr.time7.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time8='${timeArr.time8.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time9='${timeArr.time9.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                time10='${timeArr.time10.replace(new RegExp("[^0-9:]", "gi"), '')}',  
                selection='${req.body.select === true ? true : false}',
                privat='${req.body.privat === true ? true : false}',
                microbus='${req.body.microbus === true ? true : false}'
            WHERE transfer_id='${checOnTrueVal(req.body.id)}'`; 
        };
        if (req.body.param === 'transferDel') {
            resMess = 'Transfer deleted!';
            return `DELETE FROM transfers WHERE transfer_id='${checOnTrueVal(req.body.id)}'`; 
        };
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { 
            console.log(result.err);
            
            throw new Error('error-DB') };
        res.send({"res": resMess});               
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
        return `SELECT * FROM points`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB') };
        res.send({"res": result});
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
        return `SELECT town_id, name_uk FROM points`;         
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB') };
        result.forEach(element => { townsArr[`${element.town_id}`] = element.name_uk });
        return `SELECT * FROM transfers`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB') };
        const resArr = []; 
        result.forEach(element => {
            const resEl = {
                'id': element.id,
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
                'selection': element.selection === 'true' ? true : false,                
                'privat': element.privat === 'true' ? true : false,                
                'microbus': element.microbus === 'true' ? true : false,                
            };
            resArr.push(resEl);
        });
        res.send({"res": resArr});
    })
    .catch((err) => {
        log('transfers-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const variables = async (req, res) => {
    let townsFrom = {}, townsTo = {}, transfersArr = [], townsId = [],  privatArr = [], microbusArr = [], specArr = [];
    const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'].slice(0, 2) : 'uk';
    Promise.all([
        tableRecord(`SELECT town_id, name_${lang} FROM points`), 
        tableRecord(`SELECT transfer_from FROM transfers GROUP BY transfer_from`), 
        tableRecord(`SELECT transfer_to FROM transfers GROUP BY transfer_to`), 
        tableRecord(`SELECT * FROM transfers`),
        tableRecord(`SELECT transfer_id FROM transfers WHERE privat='true' AND price_pr!='' LIMIT 3`),
        tableRecord(`SELECT transfer_id FROM transfers WHERE microbus='true' AND price_gr!='' LIMIT 3`),
        tableRecord(`SELECT transfer_id FROM transfers WHERE selection='true' AND price_pr!=''`)])
    .then(([townIdRes, townsFromRes, townsToRes, transfersArrRes, privatRes, microbusRes, specRes]) => {
        if (townIdRes.err) { throw new Error('error-DB-townsID') };
        if (townsFromRes.err) { throw new Error('error-DB-transferFROM') };
        if (townsToRes.err) { throw new Error('error-DB-transferTO') };
        if (transfersArrRes.err) { throw new Error('error-DB-transfersARR') };
        if (privatRes.err) { throw new Error('error-DB-privatARR') };
        if (microbusRes.err) { throw new Error('error-DB-microbusARR') };
        if (specRes.err) { throw new Error('error-DB-specArr') };
        townIdRes.forEach(element => { townsId[`${element.town_id}`] = element[`name_${lang}`] });
        townsFromRes.forEach(element => { townsFrom[`${element.transfer_from}`] = townsId[element.transfer_from] });   
        townsToRes.forEach(element => { townsTo[`${element.transfer_to}`] = townsId[element.transfer_to] });   
        transfersArrRes.forEach(element => { transfersArr.push(element) });
        privatRes.forEach(element => { privatArr.push(element) });
        microbusRes.forEach(element => { microbusArr.push(element) });
        specRes.forEach(element => { specArr.push(element) });
    })
    .then(() => {
        // console.log('townsId', townsId);
        // console.log('townsFrom', townsFrom);
        // console.log('townsTo', townsTo);
        // console.log('transfersArr', transfersArr);
        // console.log('privatArr', privatArr);
        // console.log('microbusArr', microbusArr);
        // console.log('specArr', specArr);
        res.send({"res": {townsFrom, townsTo, transfersArr, privatArr, microbusArr, specArr}});
    })
    .catch((err) => {
        log('variables-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const orders = (req, res) => {
    const {transferId, transferFrom, transferTo, transferFromName, transferToName, adult, children, sum, date, time, equip, equip_child, user_name, user_surname, user_email, user_phone, paid} = req.body;
    const type = req.body.type.replace(/transfer_/gi, '');
    // console.log('transferId', transferId);
    // console.log('transferFrom', transferFrom);
    // console.log('transferTo', transferTo);
    // console.log('transferFromName', transferFromName);
    // console.log('transferToName', transferToName);
    // console.log('adult', adult);
    // console.log('children', children);
    // console.log('type', type);
    // console.log('date', date);
    // console.log('time', time);
    // console.log('equip', equip);
    // console.log('equip_child', equip_child);
    // console.log('user_name', user_name);
    // console.log('user_surname', user_surname);
    // console.log('user_email', user_email);
    // console.log('user_phone', user_phone);
    // console.log('paid', paid);
    // console.log('sum', sum);
    tableRecord(`SELECT price_${type} FROM transfers WHERE transfer_id='${transferId}'`)
    .then(async (result) => {
        if (result.err) { throw new Error('error-DB') };
        if (result[0] === undefined) { throw new Error('error-bad-route');
        } else {
            let sumfin;
            if (type === 'pr') {sumfin = result[0].price_pr};
            if (type === 'gr') {sumfin = result[0].price_gr * (+adult + +children) };
            return `INSERT INTO orders (orders, transfer_id, order_from, order_to, adult, children, type, date, time, equip, equip_child, user_name, user_surname, user_email, user_tel, status, paid, sum, book_date) 
            VALUES ('${token(10)}',
                    '${checOnTrueVal(transferId)}',
                    '${checOnTrueVal(transferFromName)}',
                    '${checOnTrueVal(transferToName)}',
                    '${adult}', 
                    '${children}', 
                    '${type}', 
                    '${date.replace(new RegExp("[^0-9]//", "gi"), "")}', 
                    '${time.replace(new RegExp("[^0-9]:", "gi"), "")}', 
                    '${equip.replace(new RegExp("[^a-z]", "gi"), "")}', 
                    '${equip_child}',            
                    '${checOnTrueVal(user_name)}',
                    '${checOnTrueVal(user_surname)}',
                    '${user_email.replace(new RegExp("[^a-zA-Z0-9.&@-_]", "gi"), "")}', 
                    '${user_phone.replace(new RegExp("[^0-9+]", "gi"), "")}', 
                    'reserv', 
                    'no', 
                    '${sumfin}',
                    '${readyFullDate(new Date(), '')}')`;
        };
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-oredrs') };
        res.send({"res": 'Order created!'});        
    })
    .catch((err) => {
        log('orders-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const orderslist = async (req, res) => {
    console.log('req.body.page', req.body.page);
    console.log('req.body.param', req.body.param);
    console.log('req.body.numb', req.body.numb);

    let user_info, phone_res, count_records, page = req.body.page, order_limit = req.body.numb;
    let townsFrom = {}, townsTo = {}, transfersArr = [], townsId = [];
    const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'].slice(0, 2) : 'uk';
    Promise.all([
        tableRecord(`SELECT town_id, name_${lang} FROM points`), 
        tableRecord(`SELECT transfer_from FROM transfers GROUP BY transfer_from`), 
        tableRecord(`SELECT transfer_to FROM transfers GROUP BY transfer_to`), 
        tableRecord(`SELECT * FROM transfers`)])
    .then(([townIdRes, townsFromRes, townsToRes, transfersArrRes]) => {
        if (townIdRes.err) { throw new Error('error-DB-townsID') };
        if (townsFromRes.err) { throw new Error('error-DB-transferFROM') };
        if (townsToRes.err) { throw new Error('error-DB-transferTO') };
        if (transfersArrRes.err) { throw new Error('error-DB-transfersARR') };
        townIdRes.forEach(element => { townsId[`${element.town_id}`] = element[`name_${lang}`] });
        townsFromRes.forEach(element => { townsFrom[`${element.transfer_from}`] = townsId[element.transfer_from] });   
        townsToRes.forEach(element => { townsTo[`${element.transfer_to}`] = townsId[element.transfer_to] });   
        transfersArrRes.forEach(element => { transfersArr.push(element) });
    })
    await autorisationCheck(req, res)    
    .then((userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        // console.log('userid', userid);
        return `SELECT email, phone, phone_verified, permission FROM users WHERE userid='${userid.userid}'`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-get-user') };
        if (result[0].phone_verified === 'verified') { phone_res = result[0].phone.slice(result[0].phone.length - 10, result[0].phone.length) };
        user_info = result;
    })
    .then(() => {
        // console.log('user-result', user_info);
        if (user_info[0].permission === 1) {
            return (req.body.param === '')
                ? `SELECT COUNT(*) FROM orders`
                : ``;
        } else {
            return (user_info[0].phone_verified === 'verified')  
                ? `SELECT COUNT(*) FROM orders WHERE user_email='${user_info[0].email}' OR user_tel='${phone_res}' OR user_tel='+38${phone_res}'`
                : `SELECT COUNT(*) FROM orders WHERE user_email='${user_info[0].email}'`;
        };
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-get-count') };
        for (const [key, value] of Object.entries(result[0])) { count_records = value };
    })
    // .then(() => {
    //     console.log('townsId', townsId);
    //     console.log('townsFrom', townsFrom);
    //     console.log('townsTo', townsTo);
    //     console.log('transfersArr', transfersArr);
    // })
    .then(() => {
        let page_start = (page -1) * order_limit;
        // console.log('page', page);
        // console.log('order_limit', order_limit);
        // console.log('page_start', page_start);
        if (user_info[0].permission === 1) {
            return (req.body.param === '')
                ? `SELECT * FROM orders 
                    ORDER BY id DESC LIMIT ${page_start}, ${order_limit}`
                : ``;
        } else {
            return (user_info[0].phone_verified === 'verified')  
                ? `SELECT * FROM orders 
                    WHERE user_email='${user_info[0].email}' OR user_tel='${phone_res}' OR user_tel='+38${phone_res}' 
                    ORDER BY id DESC LIMIT ${page_start}, ${order_limit}`
                : `SELECT * FROM orders 
                    WHERE user_email='${user_info[0].email}' 
                    ORDER BY id DESC LIMIT ${page_start}, ${order_limit}`;
        };
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) {             
        // console.log(result.err);
        throw new Error('error-DB-get-orders') };
        // console.log('count_records', count_records);
        // console.log('result', result);
        console.log('user-result', user_info);
        console.log('user-permission', user_info.permission);
        result.forEach(element => {
            transfersArr.forEach(el => {
                if (el.transfer_id === element.transfer_id) {
                    element.order_from = townsFrom[el.transfer_from];
                    element.order_to = townsTo[el.transfer_to];
                };                
            });         
            element.proof = element.status;    
            element.settings = false;        
            if (user_info[0].permission === 1) {
                element.settings = true;
            };             
        });
        res.send({"res": {'count': count_records, 'orders': result}});
    })
    .catch((err) => {
        log('orders-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const orderstatus = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        let status = (req.body.param === 'proof' || req.body.param === 'del') ? req.body.param : 'reserv';
        return `UPDATE orders SET status='${status}' WHERE orders='${req.body.id}'`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-orderstatus') };
        res.send({"res": 'Status saved!'});
    })
    .catch((err) => {
        log('towns-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const saveposition = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        let sqlvalarr = [];
        for (const [key, value] of Object.entries(req.body)) { sqlvalarr.push(`WHEN id = ${key} THEN ${value}`) };
        return `UPDATE transfers SET id = CASE ${sqlvalarr.join(' ')} END`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-saveposition') };
        res.send({"res": 'Position saved!'});
    })
    .catch((err) => {
        log('towns-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

module.exports = {
    townadd,
    transferadd,
    townlist,
    transferlist,
    variables,
    orders,
    orderslist,
    orderstatus,
    saveposition
}