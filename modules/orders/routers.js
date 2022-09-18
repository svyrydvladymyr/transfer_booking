const Router = require('express');
const ordersRouter = new Router;
const orders = require('./OrdersController');
const {autorisation, permission} = require('../service');

ordersRouter.post('/create', orders.order);

module.exports = ordersRouter;