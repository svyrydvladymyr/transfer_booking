const Router = require('express');
const transfersRouter = new Router;
const transfers = require('./transfersController');

transfersRouter.get('/list', transfers.transfer)
transfersRouter.post('/create', transfers.transfer)
transfersRouter.post('/saveposition', transfers.transfer)
transfersRouter.put('/update', transfers.transfer)
transfersRouter.delete('/delete', transfers.transfer)

module.exports = transfersRouter;