const Router = require('express');
const transfersRouter = new Router;
const transfers = require('./transfersController');
const {autorisation, permission} = require('../service');

transfersRouter.use(autorisation, permission);
transfersRouter.get('/list', transfers.transfer)
transfersRouter.post('/open', transfers.transfer)
transfersRouter.post('/create', transfers.transfer)
transfersRouter.post('/saveposition', transfers.transfer)
transfersRouter.put('/edit', transfers.transfer)
transfersRouter.delete('/delete/:transferid$', transfers.transfer)

module.exports = transfersRouter;