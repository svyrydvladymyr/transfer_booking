const Url = require('url-parse');
const pagesService = require('./pagesService');
const lang_list = ['uk-UA', 'en-GB', 'ru-RU'];
const pages_list = ['home', 'about', 'advantages', 'blog', 'contacts', 'person', 'privacy-policy', 'transfer'];

class PagesController{
    async userData(req, res) {
        const lang = lang_list.includes(req.cookies ? req.cookies['lang'] : undefined)
            ? req.cookies['lang']
            : 'uk-UA';
        const pathname = Url(req.url, true).pathname;
        const pagename = (pages_list.includes(pathname.replace('/', '')))
            ? pathname.replace('/', '')
            : 'home';
        await pagesService.getUser(req, res, lang, pagename)
            .then((DATA) => { res.render(pagename, { DATA }) })
            .catch((error) => {
                console.log('ERROR:', error);
                res.status(500).send('500 (Internal Server Error)');
            })
    };
}

module.exports = new PagesController();
