const con = require('./db-models/connectDB').con;
const {log, query, clienttoken, readyFullDate} = require('./service');

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
        blog : '',
        transfer : '',
        contacts : '',
    },
    user : {
        id : '',
        name : '',
        surname : '',
        foto : 'img/no_user.png',
        email : '',
        phone : '',
        provider : '',
        lang : 'uk-UA',
        date_registered : '',
        year : ''
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
    DATA.user.phone = '';
    DATA.user.provider = '';
    DATA.user.lang = 'uk-UA';
    DATA.user.date_registered = '';
    DATA.user.year = '';
    DATA.menu.home = '',
    DATA.menu.about = '',
    DATA.menu.blog = '',
    DATA.menu.transfer = '',
    DATA.menu.contacts = '',
    DATA.permission.permissionAuthorization = '0';
    DATA.permission.permissionRules = '0';
    DATA.permission.pageName = '';
    DATA.person.townArr = '';
    DATA.person.routeArr = '';
    DATA.errors.errMessage = '';
    DATA.errors.SERVER_ERROR = '';
    DATA.langPack = require('./lang/uk-UA');
};

const createUser = (profile) => {
    const date = new Date();
    return user = {
        id : profile.id,
        provider : profile.provider,
        firstName: profile.name && profile.name.givenName ? profile.name.givenName : '',
        lastName: profile.name && profile.name.familyName ? profile.name.familyName : '',
        email: profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined ? profile.emails[0].value : '',
        photo: profile.photos && profile.photos.length > 0 && profile.photos[0].value !== undefined ? profile.photos[0].value : '',
        date : `${date.toISOString().slice(0,10)} ${date.getHours()}:${date.getMinutes()}`
    };
};

const addUser = (profile, done) => {
    const user = createUser(profile);
    const sql = `INSERT INTO users (userid, name, surname, provider, email, date_registered, ava)
               VALUES ('${user.id}',
               '${user.firstName}',
               '${user.lastName}',
               '${user.provider}',
               '${user.email}',
               '${user.date}',
               '${user.photo}')`;
    con.query(sql, (error, result) => {
        error
            ? done(`Error creating user record: ${error}`, null)
            : done(null, profile);
    });
};

const isUser = (profile) => {
    const user = createUser(profile);
    con.query(`UPDATE users SET 
        name = '${user.firstName}', 
        surname = '${user.lastName}', 
        email = '${user.email}',
        ava = '${user.photo}'
    WHERE userid = '${user.id}'`, (err, result) => {
        if (err) { log("error-update-user", err) };
    });
};

const getUser = async (req, res, lang = 'uk-UA', pageName) => {
    clearDATA();
    ['home', 'about', 'blog', 'transfer', 'contacts'].includes(pageName) ? DATA.menu[pageName] = 'active_menu' : DATA.menu.home = 'active_menu';
    DATA.langPack = require(`./lang/${lang}`);
    DATA.permission.pageName = pageName;
    await query(`SELECT * FROM users WHERE token = '${clienttoken(req, res)}'`)
        .then((user) => {
            if (!user[0]) return;

            const {userid, name, surname, ava, email, phone, phone_verified, provider, permission, date_registered} = user[0];
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
            DATA.user.year = new Date().getFullYear();
            DATA.permission.pageName = pageName;
            DATA.langPack = require(`./lang/${lang}`);
            if (pageName === 'person') {
                DATA.user.ava = ava;
                DATA.user.email = email;
                DATA.user.phone = phone;
                DATA.user.phone_verified = phone_verified;
                DATA.user.provider = provider;
                DATA.user.date_registered = readyFullDate(date_registered, 'reverse');
                DATA.menu.home = 'active_menu'
                if (permission === 1) {
                    DATA.person.townArr = ``;
                    DATA.person.routeArr = ``;
                };
            };
        })
        .catch((err) => {
            log('ERROR:-user-info', err);
        });
    return DATA;
};

module.exports = {
    addUser,
    isUser,
    getUser,
    clearDATA,
    DATA
}