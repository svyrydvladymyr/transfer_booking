const Router = require('express');
const newsRouter = new Router;
const news = require('./newsController');
const {autorisation, permission} = require('../service');

newsRouter.get('/', news.news);
newsRouter.get('/:newsalias$', news.news);
newsRouter.get('/list/:limit$', news.news);
newsRouter.get('/open/:newsid$', autorisation, permission, news.news);
newsRouter.post('/create', autorisation, permission, news.news);
newsRouter.post('/edit', autorisation, permission, news.news);
newsRouter.delete('/delete/:newsid$', autorisation, permission, news.news);

module.exports = newsRouter;