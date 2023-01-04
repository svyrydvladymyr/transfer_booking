const Url = require('url-parse');
const user = require('./user').users;
const log = require('./service').log;
const lang_list = ['uk-UA', 'en-GB', 'ru-RU'];
const pages_list = ['home', 'about', 'advantages', 'blog', 'contacts', 'person', 'privacy-policy', 'transfer'];

class Pages{
    async userData(req, res) {
        const lang = lang_list.includes(req.cookies ? req.cookies['lang'] : undefined)
            ? req.cookies['lang']
            : 'uk-UA';
        const pathname = Url(req.url, true).pathname;
        const pagename = (pages_list.includes(pathname.replace('/', '')))
            ? pathname.replace('/', '')
            : 'home';

        console.log('lang', lang);
        console.log('pagename', pagename);

        await user.getUser(req, res, lang, pagename)
            // .then(() => require('./user').DATA)
            .then((DATA) => {
                // console.log('gggg', DATA);
                console.log('gggg', DATA.permission.permissionAuthorization);

                res.render(pagename, { DATA });
            })
            .catch((error) => {
                log('ERROR:', error);
                res.status(500).send('500 (Internal Server Error)');
            })
    };
}

module.exports = new Pages();
