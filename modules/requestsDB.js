const con = require('../db/connectToDB').con;
const {checOnTrueVal, autorisationCheck, tableRecord, token, log, readyFullDate, clienttoken} = require('../modules/service');

const town = (req, res) => {
    let sql;
    if (req.body.param === 'townAdd') {
        sql = `INSERT INTO points (town_id, name_uk, name_en, name_ru) 
        VALUES ('${checOnTrueVal(req.body.id)}', 
                '${checOnTrueVal(req.body.uk)}', 
                '${checOnTrueVal(req.body.en)}', 
                '${checOnTrueVal(req.body.ru)}')`; 
    };
    if (req.body.param === 'townEdit') {
        sql = `UPDATE points 
        SET name_uk='${checOnTrueVal(req.body.uk)}', name_en='${checOnTrueVal(req.body.en)}', name_ru='${checOnTrueVal(req.body.ru)}' 
        WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
    };
    if (req.body.param === 'townDel') {
        sql = `DELETE FROM points WHERE town_id='${checOnTrueVal(req.body.id)}'`; 
    };
    tableRecord(sql)
    .then((result) => {
        if (result.err && result.err.code == 'ER_DUP_ENTRY') {
            const arr = [req.body.id, req.body.uk, req.body.en, req.body.ru];
            for (let i = 0; i < arr.length; i++) {
                if (result.err.sqlMessage.includes(arr[i])) {
                    res.send({"DUP": arr[i]}); break;
                };
            };                
        };
        if (result.err && result.err.code !== 'ER_DUP_ENTRY') { throw new Error(`err-${req.body.param}`) };             
        if (req.body.param !== 'townDel') { res.send({"res": `${req.body.param}`}) };
        if (req.body.param === 'townDel') {
            sql = `DELETE FROM transfers WHERE transfer_from='${checOnTrueVal(req.body.id)}' OR transfer_to='${checOnTrueVal(req.body.id)}'`; 
            tableRecord(sql)
            .then((result) => {
                if (result.err) { throw new Error(`err-${req.body.param}`) };
                res.send({"res": `${req.body.param}`});  
            });
        };               
    })
    .catch((err) => {
        log('towns-err', err);
        res.status(400).send('');
    });
};

const transfer = (req, res) => {
    const timeArr = {'time1' : '', 'time2' : '', 'time3' : '', 'time4' : '', 'time5' : '', 'time6' : '', 'time7' : '', 'time8' : '', 'time9' : '', 'time10' : ''};
    let sql;
    if (req.body.param !== 'transferDel') { req.body.times.forEach((element, index) => { timeArr[`time${index + 1}`] = element.replace(new RegExp("[^0-9:]", "gi"), '')})};    
    if (req.body.param === 'transferAdd') {
        sql = `INSERT INTO transfers (transfer_id, transfer_from, transfer_to, price_pr, price_gr, time1, time2, time3, time4, time5, time6, time7, time8, time9, time10, selection, privat, microbus) 
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
                '${req.body.select === true ? true : false}', 
                '${req.body.privat === true ? true : false}', 
                '${req.body.microbus === true ? true : false}')`; 
    };
    if (req.body.param === 'transferEdit') {
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
            selection='${req.body.select === true ? true : false}',
            privat='${req.body.privat === true ? true : false}',
            microbus='${req.body.microbus === true ? true : false}'
        WHERE transfer_id='${checOnTrueVal(req.body.id)}'`; 
    };
    if (req.body.param === 'transferDel') {
        sql = `DELETE FROM transfers WHERE transfer_id='${checOnTrueVal(req.body.id)}'`; 
    };
    tableRecord(sql)
    .then((result) => {
        if (result.err) { throw new Error(`err-${req.body.param}`) };
        res.send({"res": `${req.body.param}`});               
    })
    .catch((err) => {
        log('transfers-error', err);
        res.status(400).send('');
    });
};

const townlist = (req, res) => {
    tableRecord(`SELECT * FROM points`)
    .then((result) => {
        if (result.err) { throw new Error(`error-${req.originalUrl}`)};
        res.send({"res": result});
    })
    .catch((err) => {
        log('towns-list-error', err);
        res.status(400).send('');
    });
};

const transferlist = (req, res) => {
    const townsArr = {};
    tableRecord(`SELECT town_id, name_uk FROM points`)
    .then((result) => {
        if (result.err) { throw new Error('error-get-town-list') };
        result.forEach(element => { townsArr[`${element.town_id}`] = element.name_uk });
        return `SELECT * FROM transfers`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-get-transfer-list') };
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
        res.status(400).send('');
    });
};


const townNames = ({req, res}) => {
    let townsFrom = {}, townsTo = {}, transfersArr = [], townsId = [];
    const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'].slice(0, 2) : 'uk';
    return new Promise((resolve) => { 
        Promise.all([
            tableRecord(`SELECT town_id, name_${lang} FROM points`), 
            tableRecord(`SELECT transfer_from FROM transfers GROUP BY transfer_from`), 
            tableRecord(`SELECT transfer_to FROM transfers GROUP BY transfer_to`), 
            tableRecord(`SELECT * FROM transfers`)])
        .then( ([townIdRes, townsFromRes, townsToRes, transfersArrRes]) => {
            if (townIdRes.err) { throw new Error('error-DB-townsID') };
            if (townsFromRes.err) { throw new Error('error-DB-transferFROM') };
            if (townsToRes.err) { throw new Error('error-DB-transferTO') };
            if (transfersArrRes.err) { throw new Error('error-DB-transfersARR') };
            townIdRes.forEach(element => { townsId[`${element.town_id}`] = element[`name_${lang}`] });
            townsFromRes.forEach(element => { townsFrom[`${element.transfer_from}`] = townsId[element.transfer_from] });   
            townsToRes.forEach(element => { townsTo[`${element.transfer_to}`] = townsId[element.transfer_to] });   
            transfersArrRes.forEach(element => { transfersArr.push(element) });
            resolve({townsFrom, townsTo, transfersArr});
        })
        .catch((err) => {
            log('variables-list-error', err);
            res.status(400).send('');
        });
    });
};

const variables = (req, res) => {
    let privatArr = [], microbusArr = [], specArr = [];
    Promise.all([
        tableRecord(`SELECT transfer_id FROM transfers WHERE privat='true' AND price_pr!='' LIMIT 3`),
        tableRecord(`SELECT transfer_id FROM transfers WHERE microbus='true' AND price_gr!='' LIMIT 3`),
        tableRecord(`SELECT transfer_id FROM transfers WHERE selection='true' AND price_pr!=''`)])
    .then(([privatRes, microbusRes, specRes]) => {
        if (privatRes.err) { throw new Error('error-DB-privatARR') };
        if (microbusRes.err) { throw new Error('error-DB-microbusARR') };
        if (specRes.err) { throw new Error('error-DB-specArr') };
        privatRes.forEach(element => { privatArr.push(element) });
        microbusRes.forEach(element => { microbusArr.push(element) });
        specRes.forEach(element => { specArr.push(element) });
        return {req, res};
    })
    .then(townNames)
    .then(({townsFrom, townsTo, transfersArr}) => {
        res.send({"res": {townsFrom, townsTo, transfersArr, privatArr, microbusArr, specArr}});
    })
    .catch((err) => {
        log('variables-list-error', err);
        res.status(400).send('');
    });
};

const orders = (req, res) => {
    const {transferId, transferFromName, transferToName, adult, children, sum, date, time, equip, equip_child, user_name, user_surname, user_email, user_phone, paid} = req.body;
    const type = req.body.type.replace(/transfer_/gi, '');
    let userid = '';
    tableRecord(`SELECT userid FROM users WHERE token = '${clienttoken(req, res)}'`)
    .then((user) => { 
        userid = !user.err && user != '' ? user[0].userid : '';
        return `SELECT price_${type} FROM transfers WHERE transfer_id='${transferId}'`
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('err-creating-order') };
        if (result[0] === undefined) { throw new Error('err-bad-route');
        } else {
            let sumfin;
            if (type === 'pr') {sumfin = result[0].price_pr};
            if (type === 'gr') {sumfin = result[0].price_gr * (+adult + +children) };
            return `INSERT INTO orders (orders, user_id, transfer_id, order_from, order_to, adult, children, type, date, time, equip, equip_child, user_name, user_surname, user_email, user_tel, status, paid, sum, book_date) 
            VALUES ('${token(10)}',
                    '${userid}',
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
        res.status(400).send('');
    });
};

const orderslist = (req, res) => {
    let user_info = req.user[0], phone_res, count_records, page = req.body.page, order_limit = req.body.numb;
    let townsFrom = {}, townsTo = {}, transfersArr = [], sql = '', countsql = '', ordersresult = {};
    if (user_info.phone_verified === 'verified') { phone_res = user_info.phone.slice(user_info.phone.length - 10, user_info.phone.length) };
    townNames({req, res})
    .then((towns) => { 
        townsFrom = towns.townsFrom;
        townsTo = towns.townsTo;
        transfersArr = towns.transfersArr
    })
    .then(() => {
        let page_start = (page -1) * order_limit;
        if (user_info.permission === 1) {
            let where = '', status = '', datesql = '';
            const orderstatus = req.body.param[0]['status'];
            const orderdate = req.body.param[1]['orderdate'];
            if (orderdate !== '') {
                where = ' WHERE ';
                const present_date = readyFullDate(new Date(), '');
                const date = new Date();
                date.setMonth(date.getMonth() - +orderdate);
                const next_date = readyFullDate(date, '');
                datesql = `book_date>'${next_date}' AND book_date<'${present_date}' `;
            };               
            if (orderstatus !== '' && orderdate !== '') {
                status = `AND status='${orderstatus}' `;
            };
            if (orderstatus !== '' && orderdate === '') {
                where = ' WHERE ';
                status = `status='${orderstatus}' `;
            };
            countsql = `SELECT COUNT(*) FROM orders${where}${datesql}${status}`;
            return `SELECT * FROM orders${where}${datesql}${status} ORDER BY id DESC LIMIT ${page_start}, ${order_limit}`;
        } else {
            countsql = (user_info[0].phone_verified === 'verified')  
                ? `SELECT COUNT(*) FROM orders WHERE user_id='${user_info.userid}' OR user_email='${user_info.email}' OR user_tel='${phone_res}' OR user_tel='+38${phone_res}'`
                : `SELECT COUNT(*) FROM orders WHERE user_id='${user_info.userid}' OR user_email='${user_info.email}'`;
            return (user_info.phone_verified === 'verified')  
                ? `SELECT * FROM orders 
                    WHERE user_id='${user_info.userid}' OR user_email='${user_info.email}' OR user_tel='${phone_res}' OR user_tel='+38${phone_res}' 
                    ORDER BY id DESC LIMIT ${page_start}, ${order_limit}`
                : `SELECT * FROM orders 
                    WHERE user_id='${user_info.userid}' OR user_email='${user_info.email}' 
                    ORDER BY id DESC LIMIT ${page_start}, ${order_limit}`;
        };
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('err-get-orders') };
        result.forEach(element => {
            transfersArr.forEach(el => {
                if (el.transfer_id === element.transfer_id) {
                    element.order_from = townsFrom[el.transfer_from];
                    element.order_to = townsTo[el.transfer_to];
                };                
            });         
            element.proof = element.status;    
            element.settings = false;        
            if (user_info.permission === 1) {
                element.settings = true;
            };             
        });  
        ordersresult = result;
        return countsql;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('err-get-count') };
        for (const [key, value] of Object.entries(result[0])) { count_records = value };
    })
    .then(() => { res.send({"res": {'count': count_records, 'orders': ordersresult}}) })
    .catch((err) => {
        log('orders-error', err);
        res.status(400).send('');
    });
};

const orderstatus = (req, res) => {
    let status = (req.body.param === 'proof' || req.body.param === 'del') ? req.body.param : 'reserv';
    tableRecord(`UPDATE orders SET status='${status}' WHERE orders='${req.body.id}'`)
    .then((result) => {
        if (result.err) { throw new Error('err-orderstatus') };
        res.send({"res": 'Status saved!'});
    })
    .catch((err) => {
        log('order-status-list-error', err);
        res.status(400).send('');
    });
};

const saveposition = (req, res) => {
    let sqlvalarr = [];
    for (const [key, value] of Object.entries(req.body)) { sqlvalarr.push(`WHEN id = ${key} THEN ${value}`) };
    tableRecord(`UPDATE transfers SET id = CASE ${sqlvalarr.join(' ')} END`)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-saveposition') };
        res.send({"res": 'Position saved!'});
    })
    .catch((err) => {
        log('save_position-list-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};

const sendfeedback = (req, res) => {
    const {feedbackName, feedbackSurname, feedbackEmail, feedbackPhone, feedbackComment} = req.body;
    let userid = '';
    tableRecord(`SELECT userid FROM users WHERE token = '${clienttoken(req, res)}'`)
    .then((user) => { 
        userid = !user.err && user != '' ? user[0].userid : '';
        return `INSERT INTO feedback (idfeedback, user_id, feedbackName, feedbackSurname, feedbackEmail, feedbackPhone, feedbackComment, date_create, status, answer, date_answer) 
            VALUES ('${token(10)}',  
                '${userid}',     
                '${checOnTrueVal(feedbackName)}',
                '${checOnTrueVal(feedbackSurname)}',
                '${feedbackEmail.replace(new RegExp("[^a-zA-Z0-9.&@-_]", "gi"), "")}', 
                '${feedbackPhone.replace(new RegExp("[^0-9+]", "gi"), "")}', 
                '${checOnTrueVal(feedbackComment)}',
                '${readyFullDate(new Date(), '')}',
                'noanswer',
                '',
                '${readyFullDate(new Date(), '')}')`;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('err-feedback') };
        res.send({"res": 'Feedback sended!'});
    })
    .catch((err) => {
        log('send-feedback-list-error', err);
        res.status(400).send('');
    });
};

const feedbacklist = (req, res) => {
    let user_info = req.user[0], phone_res, count_records; 
    let page = req.body.page, feedback_limit = req.body.feedback_numb, sql = '', countsql = '', feedbackresult = {};
    if (user_info.phone_verified === 'verified') { phone_res = user_info.phone.slice(user_info.phone.length - 10, user_info.phone.length) };

 
        let page_start = (page -1) * feedback_limit;
        if (user_info.permission === 1) {
            let where = '', status = '', datesql = '';
            const feedbackstatus = req.body.param[0]['status'];
            const feedbackdate = req.body.param[1]['feedbackdate'];
            if (feedbackdate !== '') {
                where = ' WHERE ';
                const present_date = readyFullDate(new Date(), '');
                const date = new Date();
                date.setMonth(date.getMonth() - +feedbackdate);
                const next_date = readyFullDate(date, '');
                datesql = `date_create>'${next_date}' AND date_create<'${present_date}' `;
            };               
            if (feedbackstatus !== '' && feedbackdate !== '') {
                status = `AND status='${feedbackstatus}' `;
            };
            if (feedbackstatus !== '' && feedbackdate === '') {
                where = ' WHERE ';
                status = `status='${feedbackstatus}' `;
            };
            countsql = `SELECT COUNT(*) FROM feedback${where}${datesql}${status}`;
            sql = `SELECT * FROM feedback${where}${datesql}${status} ORDER BY id DESC LIMIT ${page_start}, ${feedback_limit}`;
        } else {
            countsql = (user_info[0].phone_verified === 'verified')  
                ? `SELECT COUNT(*) FROM feedback WHERE user_id='${user_info.userid}' OR feedbackEmail='${user_info.email}' OR feedbackPhone='${phone_res}' OR feedbackPhone='+38${phone_res}'`
                : `SELECT COUNT(*) FROM feedback WHERE user_id='${user_info.userid}' OR feedbackEmail='${user_info.email}'`;
            sql = (user_info.phone_verified === 'verified')  
                ? `SELECT * FROM feedback 
                    WHERE user_id='${user_info.userid}' OR feedbackEmail='${user_info.email}' OR feedbackPhone='${phone_res}' OR feedbackPhone='+38${phone_res}' 
                    ORDER BY id DESC LIMIT ${page_start}, ${feedback_limit}`
                : `SELECT * FROM feedback 
                    WHERE user_id='${user_info.userid}' OR feedbackEmail='${user_info.email}' 
                    ORDER BY id DESC LIMIT ${page_start}, ${feedback_limit}`;
        };

    tableRecord(sql)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-get-feedback') };
        result.forEach(element => {
            element.date_answer = readyFullDate(element.date_answer, '');        
            element.date_create = readyFullDate(element.date_create, '');        
            element.settings = 'false';        
            if (user_info.permission === 1) {
                element.settings = 'true';
            };             
        });  
        feedbackresult = result;
        return countsql;
    })
    .then(tableRecord)
    .then((result) => {
        if (result.err) { throw new Error('error-DB-get-count') };
        for (const [key, value] of Object.entries(result[0])) { count_records = value };
    })
    .then(() => { res.send({"res": {'count': count_records, 'feedback': feedbackresult}}) })
    .catch((err) => {
        log('feedback-list-error', err);
        res.status(400).send('');
    });
};

const sendanswer = (req, res) => {
    let sql = `UPDATE feedback SET status='answer', answer='${req.body.answer}', date_answer='${readyFullDate(new Date(), '')}' WHERE idfeedback='${req.body.id}'`;
    tableRecord(sql)
    .then((result) => {
        if (result.err) { throw new Error('err-feedback-answer') };
        res.send({"res": 'Answer added!'});
    })
    .catch((err) => {
        log('answer-list-error', err);
        res.status(400).send('');
    });
};

module.exports = {
    town,
    transfer,
    townlist,
    transferlist,
    variables,
    orders,
    orderslist,
    orderstatus,
    saveposition,
    sendfeedback,
    feedbacklist,
    sendanswer    
}