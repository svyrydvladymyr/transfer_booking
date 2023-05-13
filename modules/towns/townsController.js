const townsService = require("./townsService");
const errorLog = require('../service').errorLog;

class TownsController {
    async town(req, res) {
        try {
            const query_res = await townsService[`${req.url.replace("/", "")}`](await townsService.checkValue(req.body), req, res);
            res.send({ res: query_res });
        } catch (error) {
            errorLog(error, 'error', 'towns', req);
            if (error.code === "ER_DUP_ENTRY") {
                const duplicateTowns = await townsService.duplicateTowns(error, req.body);
                res.send(duplicateTowns);
                return;
            }
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new TownsController();
