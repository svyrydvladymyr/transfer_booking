const feedbacksService = require('./feedbacksService');
const cosole_log = require('../service').log;

class FeedbacksController {
    async feedback(req, res) {
        try {
            const query_res = await feedbacksService[req.url.replaceAll("/", "")](req, res);
            res.send({ res: query_res });
        } catch (error) {
            cosole_log(error);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new FeedbacksController();