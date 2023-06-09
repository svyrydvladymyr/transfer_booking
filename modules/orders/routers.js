const Router = require('express');
const ordersRouter = new Router;
const orders = require('./ordersController');
const {autorisation, permission, user} = require('../service');

ordersRouter.post('/order', user, orders.order);
ordersRouter.get('/list', autorisation, orders.order);
ordersRouter.get('/open/:orderid$', autorisation, orders.order);
ordersRouter.post('/orderstatus', autorisation, permission, orders.order);

module.exports = ordersRouter;