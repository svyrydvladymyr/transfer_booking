const townsService = require('./townsService');
const cosole_log = require('../service').log;

class TownsController {
    async town(req, res) {
        try {
            const query_res = await townsService[req.url.replaceAll('/', '')](await townsService.checkValue(req.body));
            res.send({"res": query_res});
        } catch (error) {
            cosole_log(error);
            if (error.code === 'ER_DUP_ENTRY') {
                const duplicateTowns = await townsService.duplicateTowns(error, req.body);
                res.send(duplicateTowns);
                return
            };
            res.status(400).send('400 (Bad Request)');
        };
    };
};

module.exports = new TownsController();