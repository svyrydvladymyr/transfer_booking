const Router = require('express');
const transfersRouter = new Router;
const transfers = require('./transfersController');

transfersRouter.get('/transferlist', transfers.transfer)
transfersRouter.post('/', transfers.transfer)
transfersRouter.put('/', transfers.transfer)
transfersRouter.delete('/', transfers.transfer)

module.exports = transfersRouter;