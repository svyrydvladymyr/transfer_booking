const Router = require('express');
const feedbacksRouter = new Router;
const feedbacks = require('./feedbacksController');
const {autorisation, permission} = require('../service');

feedbacksRouter.post('/feedback', feedbacks.feedback);
feedbacksRouter.get('/list', autorisation, feedbacks.feedback);
feedbacksRouter.get('/open/:feedbacksid$', autorisation, permission, feedbacks.feedback);
feedbacksRouter.post('/answer', autorisation, permission, feedbacks.feedback);

module.exports = feedbacksRouter;