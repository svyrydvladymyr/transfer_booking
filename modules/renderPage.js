module.exports = (req, res) => {
    const originalUrl = req.originalUrl;
    const DATA = require('./user').DATA;
    const Url = require('url-parse');
    const parseUrl = Url(req.url, true);
    const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'] : 'uk-UA';
    let pageName = `${parseUrl.pathname.replace('/', '')}`;
    pageName = (pageName === '') ? 'home' : pageName;
    require('./user').clearDATA();
    require('./user').getUser(req, res, lang, pageName)
        .then(() => {
            res.render(pageName, { DATA });
        });
};
