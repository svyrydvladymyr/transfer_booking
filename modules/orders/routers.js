const Router = require('express');
const ordersRouter = new Router;
const orders = require('./ordersController');
const {autorisation, permission} = require('../service');

ordersRouter.post('/create', orders.order);

module.exports = ordersRouter;