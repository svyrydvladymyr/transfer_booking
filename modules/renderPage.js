module.exports = (req, res) => {
    const DATA = require('./user').DATA;
    const Url = require('url-parse');
    const pathname = Url(req.url, true).pathname;

    const lang = ['uk-UA', 'en-GB', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'] : 'uk-UA';

    const pagename = (pathname === '/') ? 'home' : pathname.replace('/', '');

    console.log('pagename', pagename);

    require('./user')
        .clearDATA();
    require('./user')
        .getUser(req, res, lang, pagename)
        .then(() => {
            res.render(pagename, { DATA });
        });
};
