const Router = require('express');
const townsRouter = new Router;
const towns = require('./townsController');

// const {townlist} = require('../requestsDB');

townsRouter.get('/townlist', towns.town)
townsRouter.post('/', towns.town)
townsRouter.put('/', towns.town)
townsRouter.delete('/', towns.town)

module.exports = townsRouter;