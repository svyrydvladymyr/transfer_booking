const {query, clienttoken, date} = require('../service');
const lang_list = ['uk-UA', 'en-GB', 'ru-RU'];

class Users {
    async defaultUser(pageName, lang) {
        return {
            errors : {
                errMessage : '',
                SERVER_ERROR : ''
            },
            permission : {
                permissionAuthorization : '0',
                permissionRules : '0',
                pageName : pageName || 'home'
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
            langPack : require(`../lang/${lang}`)
        };
    };

    async getUser(req, res, pageName) {
        const lang = lang_list.includes(req.cookies ? req.cookies["lang"] : undefined) ? req.cookies["lang"] : "uk-UA";
        const DATAS = await this.defaultUser(pageName, lang);
        const menu = ['home', 'about', 'blog', 'transfer', 'contacts'];
        menu.includes(pageName)
            ? DATAS.menu[pageName] = 'active_menu'
            : DATAS.menu.home = 'active_menu';
        const sql = `SELECT * FROM users WHERE token = '${clienttoken(req, res)}'`;
        return await query(sql)
            .then((user) => {
                if (!user[0]) return DATAS;
                const {userid, name, surname, ava, email, phone, phone_verified, provider, permission, date_registered} = user[0];
                DATAS.permission.permissionRules = `${permission}`;
                DATAS.permission.permissionAuthorization = '1';
                DATAS.user.id = userid;
                DATAS.user.name = name;
                DATAS.user.surname = surname;
                DATAS.user.lang = lang;
                DATAS.user.year = new Date().getFullYear();
                DATAS.langPack = require(`../lang/${lang}`);
                if (pageName === 'person') {
                    DATAS.user.ava = ava;
                    DATAS.user.email = email;
                    DATAS.user.phone = phone;
                    DATAS.user.phone_verified = phone_verified;
                    DATAS.user.provider = provider;
                    DATAS.user.date_registered = date.show('yyyy-mm-dd hh:mi', date_registered);
                    if (permission === 1) {
                        DATAS.person.townArr = ``;
                        DATAS.person.routeArr = ``;
                    };
                };
                return DATAS;
            });
    };
};

module.exports = new Users();