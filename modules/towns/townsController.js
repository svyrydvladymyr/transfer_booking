const townsService = require("./townsService");
const errorLog = require('../service').errorLog;

class TownsController {
    async town(req, res) {
        try {
            const url = req.url.split('/')[1].replace("/", "");
            const query_res = await townsService[`${url}`](req.body, req, res);
            res.send({ res: query_res });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                const duplicateTowns = await townsService.duplicateTowns(error, req.body);
                console.log('duplicateTowns', duplicateTowns);
                res.send(duplicateTowns);
                return;
            };
            errorLog(error, 'error', 'towns', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new TownsController();
