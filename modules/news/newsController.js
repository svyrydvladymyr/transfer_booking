const newsService = require('./newsService');
const pagesService = require('../pages/pagesService');
const errorLog = require('../service').errorLog;

class NewsController {
    async news(req, res) {
        try {
            const alias = req.params["newsalias"];
            const url = req.url.split('/')[1].replace("/", "");
            const route = ['create', 'edit'].includes(url) ? 'save' : alias ? 'open' : url;
            if (route === '') {
                await pagesService.getUser(req, res, 'blog')
                .then((DATA) => {
                    res.render('blog', { DATA });
                });
            } else {
                const query_res = await newsService[route](req, res, url, alias);
                (route === 'open' && alias)
                    ? await pagesService.getUser(req, res, 'blog')
                        .then((DATA) => {
                            DATA.news = query_res;
                            res.render('blog', { DATA });
                        })
                    : res.status(200).send({ res: query_res });
            };
        } catch (error) {
            errorLog(error, 'error', 'news', req);
            if (error.toString().includes('Foto error:')) {
                res.status(201).send({ error: 'Foto not saved!' });
            } else if (error.toString().includes('Page not found')) {
                res.redirect("/blog")
            } else {
                res.status(400).send("400 (Bad Request)");
            };
        };
    };
};

module.exports = new NewsController();