const newsService = require('./newsService');
const cosole_log = require('../service').log;

class NewsController {
    async news(req, res) {
        try {
            const query_res = await newsService[req.url.replaceAll("/", "")](req, res);

            console.log('query_res', query_res);

            res.send({ res: query_res });
        } catch (error) {
            cosole_log(error);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new NewsController();