require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });
const Cookies = require('cookies');
const CryptoJS = require("crypto-js");
const fs = require('fs');
const con = require('./db-models/connectDB').con;

class ShowDate {
    plusZero = (value) => ((value >= 0) && (value <= 9) && (value.toString().length === 1)) ? "0" + value : value;
    minutes = (date) => this.plusZero(date.getMinutes());
    hours = (date) => this.plusZero(date.getHours());
    seconds = (date) => this.plusZero(date.getSeconds());
    day = (date) => this.plusZero(date.getDate());
    month = (date) => this.plusZero(date.getMonth() + 1);
    year = (date) => `${date.getFullYear()}`;
    show(format = 'hh:mi:ss dd.mm.yyyy', date) {
        date = date ? new Date(date) : new Date();
        const year_length = [...format].filter(el => el === 'y').length;
        const year = year_length === 2 ? this.year(date).slice(2, 4) : this.year(date);
        return format
            .replace(/mi/g, `${this.minutes(date)}`)
            .replace(/hh|h/g, `${this.hours(date)}`)
            .replace(/ss|s/g, `${this.seconds(date)}`)
            .replace(/dd|d/g, `${this.day(date)}`)
            .replace(/mm|m/g, `${this.month(date)}`)
            .replace(/yy/g, 'y')
            .replace(/yy/g, 'y')
            .replace(/y/g, year);
    };
};

const translit = (word) => {
    const a = {
        "Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z",
        "Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh",
        "щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O",
        "Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o",
        "л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'",
        "Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
    return word.split('').map((char) => a[char] || char ).join("");
};

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
    };
};

const token = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    };
    return result;
};

const log = (mess, val, color = '') => {
    let i = 0, arrow = '';
    do {
        arrow += '-'
        i++
    } while (i < 25 - mess.length);
    if (color === '') {console.log(`\u001b[30m--${mess}-${arrow}>>\u001b[0m `, val)};
    if (color === 'error') {console.log(`\u001b[31m--${mess}-${arrow}>>\u001b[0m `, val)};
    if (color === 'info') {console.log(`\u001b[36m--${mess}-${arrow}>>\u001b[0m `, val)};
    if (color === 'log') {console.log(`\u001b[32m--${mess}-${arrow}>>\u001b[0m `, val)};
    if (color === 'mark') {console.log(`\u001b[33m--${mess}-${arrow}>>\u001b[0m `, val)};
};

const errorLog = (error,  type = 'error', param = '', req = {ip : '', url : ''}) => {
    try {
        log(param, error, 'error');
        const dir = `./logs`;
        const log_templates = {
            'error' : `IP: ${req.ip} TIME: ${new Date().toLocaleString()} URL: ${req.url} PARAM: ${param} ERROR: ${error}\n`,
            'access' : `IP: ${req.ip} TIME: ${new Date().toLocaleString()} URL: ${req.url} PARAM: ${param} ERROR: ${error}\n`,
            'telegram' : `--TELEGRAM-->> TIME: ${new Date().toLocaleString()} - MESSAGE: ${error}\n`
        }
        !fs.existsSync(dir) && fs.mkdirSync(dir);
        fs.existsSync(dir) && fs.appendFile(`${dir}/${type}_log.log`, log_templates[type], (error) => {error ? console.log(error) : null});
    } catch (error) {
        log('Error creating logs: ', error);
    };
};

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
    validValue,
    errorLog,
    query,
    autorisation,
    permission,
    clienttoken,
    addCookies,
    date : new ShowDate()

}