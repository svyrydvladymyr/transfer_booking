const Router = require('express');
const ordersRouter = new Router;
const orders = require('./ordersController');
const {autorisation, permission} = require('../service');

ordersRouter.post('/order', orders.order);
ordersRouter.post('/list', autorisation, orders.order);
ordersRouter.post('/orderstatus', autorisation, permission, orders.order);

module.exports = ordersRouter;