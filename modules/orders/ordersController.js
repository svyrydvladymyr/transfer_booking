const ordersService = require('./ordersService');
const errorLog = require('../service').errorLog;

class OrdersController {
    async order(req, res) {
        try {
            const url = req.url.split('/')[1].replace("/", "");
            const query_res = await ordersService[`${url}`](req.body, req, res);
            res.send({ res: query_res });
        } catch (error) {
            errorLog(error, 'error', 'orders', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new OrdersController();