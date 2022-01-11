const con = require('../db/connectToDB').con;
const {log, tableRecord, autorisationCheck, readyFullDate} = require('./service');
const {langList} = require('../config/config_variables');
const moment = require('moment');

const DATA = {
    errors : {
        errMessage : '',
        SERVER_ERROR : ''
    },
    permission : {
        permissionAuthorization : '0',
        permissionRules : '0',
        pageName : ''
    },
    menu : {
        home : '',
        about : '',
        transfer : '',
        contacts : '',
    },
    user : {
        id : '',
        name : '',
        surname : '',
        foto : 'img/no_user.png',
        email : '',
        lang : 'uk-UA',
        date_registered : ''
    },
    person : {
        townArr : '',
        routeArr : ''
    },
    langPack : require('./lang/uk-UA')
};

const clearDATA = () => {
    DATA.user.id = '';
    DATA.user.name = '';
    DATA.user.surname = '';
    DATA.user.foto = 'img/no_user.png';
    DATA.user.email = '';
    DATA.user.lang = 'uk-UA';
    DATA.user.date_registered = '';
    DATA.menu.home = '',
    DATA.menu.about = '',
    DATA.menu.transfer = '',
    DATA.menu.contacts = '',
    DATA.permission.permissionAuthorization = 0; 
    DATA.permission.permissionRules = 0; 
    DATA.permission.pageName = ''; 
    DATA.person.townArr = '';
    DATA.person.routeArr = '';
    DATA.errors.errMessage = '';
    DATA.errors.SERVER_ERROR = '';
    DATA.langPack = require('./lang/uk-UA');
};

const addUser = (profile, done) => {
    const {id, name: {givenName = '', familyName = ''}, emails: [{value: email = ''}], photos: [{value: photo = ''}]} = profile;
    const date = new Date();        
    const sql = `INSERT INTO users (userid, name, surname, email, date_registered, ava) 
               VALUES ('${id}', 
               '${givenName}', 
               '${familyName}', 
               '${email}', 
               '${date.toISOString().slice(0,10)} ${date.getHours()}:${date.getMinutes()}', 
               '${photo}')`;     
    con.query(sql, (error, result) => {
        error 
            ? done(`Error creating user record: ${error}`, null) 
            : done(null, profile);
    });
};

const isUser = ({id, name: {familyName = '', givenName = ''}, photos: [{value: photo = ''}]}) => {
    con.query(`UPDATE users SET 
        name = '${givenName}', 
        surname = '${familyName}', 
        ava = '${photo}'
    WHERE userid = '${id}'`, (err, result) => { 
        if (err) { log("error-update-user", err.code) };
    });
};

const getUser = async (req, res, lang = 'uk-UA', pageName) => {
    ['home', 'about', 'transfer', 'contacts'].includes(pageName) ? DATA.menu[pageName] = 'active_menu' : DATA.menu.home = 'active_menu';
    await autorisationCheck(req, res)
    .then(async (userid) => {
        // console.log('userid', userid);
        console.log('pageName', pageName);

        if (userid === false) { throw new Error('error-autorisation') };
        await tableRecord(`SELECT * FROM users WHERE userid = '${userid.userid}'`)
        .then((user) => {
            if (user.err) { throw new Error(user.err) };
            const {userid, name, surname, ava, email, permission, date_registered} = user[0];
            //permission
            DATA.permission.permissionRules = `${permission}`;
            DATA.permission.permissionAuthorization = '1';
            //user
            DATA.user.id = userid;
            DATA.user.ava = ava;
            DATA.user.name = name;
            DATA.user.surname = surname;
            DATA.user.email = email;
            DATA.user.lang = lang;
            DATA.permission.pageName = pageName;
            DATA.langPack = require(`./lang/${lang}`);
            if (pageName === 'person') {
                DATA.user.foto = ava;        
                DATA.user.email = email;        
                DATA.user.date_registered = readyFullDate(date_registered, 'reverse');
                DATA.menu.home = 'active_menu'
                if (permission === 1) {
                    DATA.person.townArr = ``;
                    DATA.person.routeArr = ``;
                };                
            };
        });   
    })
    .catch((err) => {
        log('error-user-info', err); 
        DATA.langPack = require(`./lang/${lang}`);
        DATA.permission.pageName = pageName;
        DATA.permission.permissionAuthorization = '0';   
    }); 
};

module.exports = {
    addUser,
    isUser,
    getUser,
    clearDATA,
    DATA
}