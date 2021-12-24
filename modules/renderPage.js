module.exports = (req, res, pageName, lang = 'ua', err = '') => {
    const DATA = require('./user').DATA;
    require('./user').clearDATA();
    if (err !== '') {        
        DATA.errors.SERVER_ERROR = 'SERVER ERROR: 500 (Internal Server Error)';
        console.log('SERVER ERROR:', err);
        res.status(500).render('home', { DATA });
    } else {
        const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies['lang']) ? req.cookies['lang'] : 'uk-UA';

        // console.log('lang', lang);

        require('./user').getUser(req, res, lang, pageName)
        // .then(() => { console.log("DATA", DATA) })
        .then(() => { res.render(pageName, { DATA }) });
    };
};
