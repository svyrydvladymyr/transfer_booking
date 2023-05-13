const feedbacksService = require('./feedbacksService');
const errorLog = require('../service').errorLog;

class FeedbacksController {
    async feedback(req, res) {
        try {
            const query_res = await feedbacksService[req.url.replaceAll("/", "")](req, res);
            res.send({ res: query_res });
        } catch (error) {
            errorLog(error, 'error', 'feedback', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new FeedbacksController();