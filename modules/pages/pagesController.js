const Url = require('url-parse');
const pagesService = require('./pagesService');
const pages_list = ['home', 'about', 'advantages', 'blog', 'contacts', 'person', 'privacy-policy', 'transfer'];
const errorLog = require('../service').errorLog;

class PagesController {
    async userData(req, res) {
        const pathname = Url(req.url, true).pathname;
        const pagename = pages_list.includes(pathname.replace(/\//g, "")) ? pathname.replace(/\//g, "") : "home";
        await pagesService.getUser(req, res, pagename)
            .then((DATA) => {
                res.render(pagename, { DATA });
            })
            .catch((error) => {
                errorLog(error, 'error', 'pages', req);
                res.render(pagename, { DATA });
                // res.status(500).send("500 (Internal Server Error)");
            });
    }
}

module.exports = new PagesController();
