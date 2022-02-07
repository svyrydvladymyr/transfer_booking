module.exports = (req, res) => {
    const DATA = require('./user').DATA;
    require('./user').clearDATA();
    const originalUrl = req.originalUrl; 
    const pageName = originalUrl !== undefined && originalUrl !== '/' ? originalUrl.replace('/', '') : 'home';
    const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'] : 'uk-UA';
    require('./user').getUser(req, res, lang, pageName)
    .then(() => { res.render(pageName, { DATA }) });
};
