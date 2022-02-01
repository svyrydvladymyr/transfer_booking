const Cookies = require('cookies');
const fs = require('fs');
const con = require('../db/connectToDB').con;

//transliteration
const translit = word => require('transliteration.cyr').transliterate(word);

//client token
const clienttoken = (req, res) => new Cookies(req, res, {"keys":['volodymyr']}).get('sessionisdd', {signed:true});

//validation email
const validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;

//chack on true values
const checOnTrueVal = (el) => el.replace(new RegExp("[^a-zA-Zа-яА-Я0-9-()_+=!?.'\":;/\,іІїЇєЄ /\n]", "gi"), '');

//add or clear Cookies
const addCookies = (req, res, token, param) => {
    const cookies = new Cookies(req, res, {"keys":['volodymyr']});
    cookies.set('sessionisdd', `${token}`, {maxAge: `${param}`, path: '/', signed:true});
};

//generate token
const token = length => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
    return result;
};

//consoleLog message
const log = (mess, val, arrow = '') => {
    for (let i = 0; i < 25 - mess.length; i++){ arrow += '-' };
    console.log(`--${mess}${arrow}>> `, val);   
};

//date format minutes
const readyMin = function(fullDate){
    const createDate = new Date(fullDate);
    return finDay = ((createDate.getMinutes() >= 1) && (createDate.getMinutes() <= 9)) ? "0" + createDate.getMinutes() : createDate.getMinutes();
};  

//date format day
const readyDay = function(fullDate){
    const createDate = new Date(fullDate);
    return ((createDate.getDate() >= 1) && (createDate.getDate() <= 9)) ? "0" + createDate.getDate() : createDate.getDate();
};  

//date format month
const readyMonth = function(fullDate){    
    const createDate = new Date(fullDate);
    return ((createDate.getMonth() >= 0) && (createDate.getMonth() <= 8)) ? "0" + (createDate.getMonth() + 1) : createDate.getMonth() + 1;          
}; 

//ready full date
const readyFullDate = (fullDate, reverse) => {
    const dateFull = new Date(fullDate);
    const DATE = new Date();
    if (reverse === 'reverse'){
        return ((fullDate === '') || (fullDate === undefined)) 
            ? readyDay(DATE) + "-" + readyMonth(DATE) + "-" + DATE.getFullYear() + ' ' + DATE.getHours() + ":" + readyMin(DATE) 
            : readyDay(dateFull) + "-" + readyMonth(dateFull) + "-" + dateFull.getFullYear() + ' ' + dateFull.getHours() + ":" + readyMin(dateFull);
    } else {
        return ((fullDate === '') || (fullDate === undefined))
            ? DATE.getFullYear() + "-" + readyMonth(DATE) + "-" + readyDay(DATE) + ' ' + DATE.getHours() + ":" + readyMin(DATE)
            : dateFull.getFullYear() + "-" + readyMonth(dateFull) + "-" + readyDay(dateFull) + ' ' + dateFull.getHours() + ":" + readyMin(dateFull);
    };
};

//save logs
const accessLog = (req, res, next) => {
    let logs = `IP: ${req.ip}  TIME: ${new Date().toLocaleString()}  URL: ${req.url}\n`;
    let namefile = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    fs.appendFile(`./log/${namefile}.txt`, logs, (err) => {if (err) {console.log(err)}});
    next();
};

//get table record
const tableRecord = (sql) => {
    return new Promise((resolve) => { 
        con.query(sql, function (err, result) { 
            err ? resolve({'err': err}) : resolve(result); 
        }) 
    });
};

//check the authenticity of the authorization
const autorisationCheck = async (req, res) => {
    return await tableRecord(`SELECT userid FROM users WHERE token = '${clienttoken(req, res)}'`)
    .then((user) => { 
        return (user.err || user == '') ? false : user[0]; 
    });
};

//logout
const logOut = (req, res) => {
    addCookies(req, res, '', '-1');
    res.redirect('/'); 
};

module.exports = {
    translit,
    token,
    log,
    clienttoken,
    addCookies,
    readyFullDate,
    checOnTrueVal,
    accessLog,
    tableRecord,
    validEmail,
    autorisationCheck,
    logOut
}