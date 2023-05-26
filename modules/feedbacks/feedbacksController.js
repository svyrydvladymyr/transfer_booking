const feedbacksService = require('./feedbacksService');
const errorLog = require('../service').errorLog;

class FeedbacksController {
    async feedback(req, res) {
        try {
            const url = req.url.split('/')[1].replace("/", "");
            const query_res = await feedbacksService[`${url}`](req.body, req);
            res.send({ res: query_res });
        } catch (error) {
            errorLog(error, 'error', 'feedback', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new FeedbacksController();