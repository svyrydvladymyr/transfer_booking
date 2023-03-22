const ordersService = require('./ordersService');
const cosole_log = require('../service').log;

class OrdersController {
    async order(req, res) {

        console.log('req.url.replaceAll()', req.url.replaceAll('/', ''));


        try {
            const query_res = await ordersService[req.url.replaceAll('/', '')](req, res);

            console.log('query_res', query_res);

            res.send({"res": query_res});
        } catch (error) {
            cosole_log(error);
            res.status(400).send('400 (Bad Request)');
        };
    };
}

module.exports = new OrdersController();