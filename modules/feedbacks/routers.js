const Router = require('express');
const feedbacksRouter = new Router;
const feedbacks = require('./feedbacksController');
const {autorisation, permission} = require('../service');

feedbacksRouter.post('/feedback', feedbacks.feedback);
feedbacksRouter.post('/list', autorisation, feedbacks.feedback);
feedbacksRouter.post('/answer', autorisation, permission, feedbacks.feedback);

module.exports = feedbacksRouter;