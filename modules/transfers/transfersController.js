const transfersService = require('./transfersService');
const cosole_log = require('../service').log;

class transfersController {
    async transfer(req, res) {
        try {
            const query_res = await transfersService[req.url.replaceAll('/', '')](req.body);
            res.send({"res": query_res});
        } catch (error) {
            cosole_log('ERROR:', error);
            res.status(400).send('400 (Bad Request)');
        };
    };
}

module.exports = new transfersController();