const Router = require('express');
const townsRouter = new Router;
const towns = require('./townsController');
const {autorisation, permission} = require('../service');


townsRouter.get('/variables', towns.town);

townsRouter.use(autorisation, permission);
townsRouter.get('/list', towns.town);
townsRouter.post('/create', towns.town);
townsRouter.put('/update', towns.town);
townsRouter.delete('/delete', towns.town);

module.exports = townsRouter;