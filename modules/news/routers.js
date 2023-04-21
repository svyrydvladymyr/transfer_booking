const Router = require('express');
const newsRouter = new Router;
const news = require('./newsController');
const {autorisation, permission} = require('../service');

newsRouter.post('/create', autorisation, permission, news.news);
newsRouter.post('/edit', autorisation, permission, news.news);
newsRouter.post('/fotos', autorisation, permission, news.news);
newsRouter.get('/open/:newsid$', autorisation, permission, news.news);
newsRouter.get('/list', autorisation, permission, news.news);
// newsRouter.post('/answer', autorisation, permission, news.news);

module.exports = newsRouter;