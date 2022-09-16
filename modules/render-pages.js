module.exports = (req, res) => {
    const cosole_log = require('./service').log;
    // const DATA = require('./user').DATA;
    const Url = require('url-parse');
    const pathname = Url(req.url, true).pathname;
    const userData = require('./user').getUser;

    const lang = ['uk-UA', 'en-GB', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'] : 'uk-UA';

    const pagename = (pathname === '/') ? 'home' : pathname.replace('/', '');

    console.log('pagename', pagename);

    userData(req, res, lang, pagename)
        // .then(() => require('./user').DATA)
        .then((DATA) => {
            // console.log('gggg', DATA);
            console.log('gggg', DATA.permission.permissionAuthorization);



            res.render(pagename, { DATA });
        })
        .catch((error) => {
            cosole_log('ERROR:', error);
            res.status(500).send('500 (Internal Server Error)');
        })

};
