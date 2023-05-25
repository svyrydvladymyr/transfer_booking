const transfersService = require("./transfersService");
const errorLog = require('../service').errorLog;

class transfersController {
    async transfer(req, res) {
        try {
            const url = req.url.split('/')[1].replace("/", "");
            const query_res = await transfersService[`${url}`](req.body, req, res);
            res.send({ res: query_res });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                res.send({ DUP: "Transfer duplicated!" });
                return;
            }
            errorLog(error, 'error', 'transfers', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new transfersController();
