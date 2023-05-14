require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });
const Cookies = require('cookies');
const CryptoJS = require("crypto-js");
const fs = require('fs');
const con = require('./db-models/connectDB').con;


//transliteration
const translit = (length) =>
    require('transliteration.cyr').transliterate(length);

//chack on true values - validation
const validValue = async (el, type) => {
    if (el === undefined) throw new Error(`Not valid input: ${type}`);
    switch (type) {
        case 'emailtest':
            return (el.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;
        case 'alias':
            return el.replace(new RegExp("[^a-zA-Zа-яА-ЯіІїЇєЄ ]", "gi"), '');
        case 'news':
            return el.replace(new RegExp("[^a-zA-Zа-яА-Я0-9-()_+=!?.:;'\"/\,іІїЇєЄ<> /\n]", "gi"), '');
        case 'email':
            return el.replace(new RegExp("[^a-zA-Z0-9.&@-_]", "gi"), "");
        case 'phone':
            return el.replace(new RegExp("[^0-9+]", "gi"), "");
        default:
            return el.replace(new RegExp("[^a-zA-Zа-яА-Я0-9-()_+=!?.:;/\,іІїЇєЄ /\n]", "gi"), '');
    }
};

//generate token
const token = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    };
    return result;
};

//consoleLog message
const log = (mess, val, arrow = '') => {
    let i = 0;
    do {
        arrow += '-'
        i++
    } while (i < 25 - mess.length);
    console.log(`--${mess}-${arrow}>> `, val);
};


class ShowDate {
    constructor(){}

    show(format = 'h:m:s dd.mm.yyyy', date = '') {

    }
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

//save error logs
const errorLog = (error,  type = 'error', param = '', req) => {
    try {
        console.log(error);
        const dir = `./logs`;
        const error_type = error.from ? `Unauthorized User: ${error.from.id}` : error;
        const log_templates = {
            'error' : `IP: ${req.ip} TIME: ${new Date().toLocaleString()} URL: ${req.url} PARAM: ${param} ERROR: ${error}\n`,
            'access' : `IP: ${req.ip} TIME: ${new Date().toLocaleString()} URL: ${req.url} PARAM: ${param} ERROR: ${error}\n`,
            'telegram' : `--TELEGRAM-->> TIME: ${new Date().toLocaleString()} - MESSAGE: ${error_type}\n`
        }
        !fs.existsSync(dir) && fs.mkdirSync(dir);
        fs.existsSync(dir) && fs.appendFile(`${dir}/${type}_log.log`, log_templates[type], (error) => {error ? console.log(error) : null});
    } catch (error) {
        console.log('Error creating logs: ', error);
    };
};

//get table record
const query = async (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, function (error, result) {
            error
                ? reject(error)
                : resolve(result);
        })
    });
};

const clienttoken = (req, res) => {
    const cookies_token = new Cookies(req, res, {"keys":[process.env.COOKIES_KEY]})
        .get('sessionisdd', {signed:true});
    let bytes  = CryptoJS.AES.decrypt((cookies_token === undefined) ? 'token' : cookies_token, process.env.COOKIES_KEY);
    let original_token = bytes.toString(CryptoJS.enc.Utf8);
    return original_token;
};

const addCookies = (req, res, token, param) => {
    const cipher_token = CryptoJS.AES.encrypt(token, process.env.COOKIES_KEY).toString();
    const cookies = new Cookies(req, res, {"keys":[process.env.COOKIES_KEY]});
    cookies.set(
        'sessionisdd',
        `${cipher_token}`,
        {
            maxAge : `${param}`,
            path : '/',
            signed : true,
            sameSite : true,
            secure : process.env.NODE_ENV === "production" ? true : false
        }
    );
};

const autorisation = (req, res, next) => {
    const userInfo = 'userid, email, phone, phone_verified, permission';
    query(`SELECT ${userInfo} FROM users WHERE token = '${clienttoken(req, res)}'`)
        .then((user) => {
            req.user = user;
            if (!user[0]) {
                errorLog('Not authorized user!', 'access', 'autorisation', req);
                res.status(400).send();
            } else {
                next();
            };
        }
    );
};

const permission = (req, res, next) => {
    if (req.user[0].permission !== 1) {
        errorLog('Bad permission!', 'access', 'permission', req);
        res.status(400).send();
    } else {
        next();
    };
};




module.exports = {
    translit,
    token,
    log,
    readyFullDate,
    validValue,
    errorLog,
    query,
    autorisation,
    permission,
    clienttoken,
    addCookies
}