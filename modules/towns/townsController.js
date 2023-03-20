const townsService = require('./townsService');
const cosole_log = require('../service').log;

class TownsController {
    async town(req, res) {
        try {
            const query_res = await townsService[`${req.url.replace('/', '')}`](await townsService.checkValue(req.body), req, res);

            // console.log('query_res', query_res);
            res.send({"res": query_res});
        } catch (error) {
            cosole_log('ERROR:', error.code === "ER_DUP_ENTRY" ? error.message : error);
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