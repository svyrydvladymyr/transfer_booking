const con = require('../db/connectToDB').con;
const {checOnTrueVal, autorisationCheck, tableRecord, log} = require('../modules/service');

const townadd = async (req, res) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        let created = false;
        if (userid === false) { throw new Error('error-autorisation') };
        const sql = `INSERT INTO points (town_id, name_ua, name_en, name_ru) 
            VALUES ('${checOnTrueVal(req.body.id)}dfg', 
                    '${checOnTrueVal(req.body.ua)}', 
                    '${checOnTrueVal(req.body.en)}', 
                    '${checOnTrueVal(req.body.ru)}')`; 
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
            if (!result.err) { created = true };  
            return created;     
        })
        .then((list_valid) => {
        
            console.log(list_valid);
            
            if (list_valid) {
                // res.send({"res": ''});
                let townsList;
                con.query(`SELECT * FROM points`, (error, result) => {
                    if (error) { throw new Error('error-DB') };

                    // log('towns-list', result);
                    // log('towns-list', result[0]);
                    // log('towns-list', result[0].id);
                    // log('towns-list', result[0].town_id);

                    result.forEach(element => {
                        console.log(element);
                        console.log(element.name_ua);
                        townsList += `<div class="town"><p>${element.name_ua}
                            <span>
                                <span>
                                    <i class='fas fa-edit'></i>
                                    <i class='fas fa-trash-alt'></i>
                                </span>
                                <i class='fas fa-ellipsis-h' paramID="${element.town_id}" paramUA="${element.name_ua}" paramEN="${element.name_en}" paramRU="${element.name_ru}"></i>
                            </span>
                        </p></div>`
                    });
    
                    res.send({"res": townsList});
                });
            };            
        }); 
    })
    .catch((err) => {
        log('towns-error', err);
        res.status(400).send('SERVER ERROR: 400 (Bad Request)');
    });
};


module.exports = {
    townadd
}