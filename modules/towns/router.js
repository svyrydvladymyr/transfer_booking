const Router = require('express');
const townsRouter = new Router;
const {town, townlist} = require('../requestsDB')

townsRouter.get('/townlist', townlist)
townsRouter.post('/', town)
townsRouter.put('/', town)
townsRouter.delete('/', town)

module.exports = townsRouter;