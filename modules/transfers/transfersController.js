const catch_err = require('../service').catch_err;
const transfersService = require('./transfersService');

class transfersController {
    async transfer(req, res) {
        const methods = {
            GET: 'list',
            POST: 'create',
            PUT: 'update',
            DELETE: 'delete'
        };
        try {
            const query_res = await transfersService[methods[req.method]](req.body);
            res.send(query_res);
        } catch (error) {
            catch_err(error, res, 400);
        };
    };
}

module.exports = new transfersController();