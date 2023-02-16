const transfersService = require('./transfersService');
const cosole_log = require('../service').log;

class transfersController {
    async transfer(req, res) {
        try {
            const query_res = await transfersService[`${req.url.replace('/', '')}`](req.body);
            res.send({"res": query_res});
        } catch (error) {
            cosole_log('ERROR:', error.code === "ER_DUP_ENTRY" ? error.message : error);
            if (error.code === 'ER_DUP_ENTRY') {
                res.send({"DUP": "Transfer duplicated!"});
                return
            };
            res.status(400).send('400 (Bad Request)');
        };
    };
}

module.exports = new transfersController();