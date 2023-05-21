const telegram = require('../bot/botController');
const {query, validValue, token, clienttoken, date} = require('../service');
const townsService = require('../towns/townsService');

class OredersServise {
    async order(req, res) {
        const {
            transferId,
            adult,
            children,
            date,
            time,
            equip,
            equip_child,
            user_name,
            user_surname,
            user_email,
            user_phone,
        } = req.body;
        const type = req.body.type.replace(/transfer_/gi, "");
        const tokenGen = token(10);
        const userid = await query(`SELECT userid FROM users WHERE token = '${clienttoken(req, res)}'`)
            .then((user_id) =>
                !user_id.err && user_id != "" ? user_id[0].userid : ""
            );
        const transfer = await query(`SELECT price_${type}, transfer_from, transfer_to FROM transfers WHERE transfer_id='${transferId}'`).then(
            async (transfer) => {
                if (transfer[0] === undefined) {
                    throw new Error("error-bad-route");
                };
                const price = type === "gr" ? transfer[0].price_gr * (+adult + +children) : transfer[0].price_pr;
                const town_names = await townsService.townNames(req, res);
                return {
                    price: price,
                    from: town_names.towns_from[transfer[0].transfer_from],
                    to: town_names.towns_to[transfer[0].transfer_to],
                };
            }
        );
        const sql = `INSERT INTO orders (
            orders, user_id, transfer_id, order_from, order_to,
            adult, children, type, date, time, equip, equip_child, user_name,
            user_surname, user_email, user_tel, status, paid, sum, book_date)
        VALUES ('${tokenGen}',
                '${userid}',
                '${await validValue(transferId)}',
                '${transfer.from}',
                '${transfer.to}',
                '${adult}',
                '${children}',
                '${type}',
                '${date.replace(new RegExp("[^0-9]//", "gi"), "")}',
                '${time.replace(new RegExp("[^0-9]:", "gi"), "")}',
                '${equip.replace(new RegExp("[^a-z]", "gi"), "")}',
                '${equip_child}',
                '${await validValue(user_name)}',
                '${await validValue(user_surname)}',
                '${await validValue(user_email, 'email')}',
                '${await validValue(user_phone, 'phone')}',
                'reserv',
                'no',
                '${transfer.price}',
                '${date.show('yyyy-mm-dd hh:mi')}')`;
        return await query(sql)
            .then((result) => {
                const varArr = {
                    'yes': 'Так',
                    'no': 'Ні',
                    'pr': 'Приватний',
                    'gr': 'Груповий',
                    'reserv': 'Зарезервовано',
                    'del': 'Скасовано',
                    'proof': 'Підтверджено',
                }
                const telegramOrder = 'Order ID: ' + tokenGen + '\n' +
                    user_surname + ' ' +
                    user_name + '\n' +
                    'Tel: ' + user_phone + '\n' +
                    'Email: ' + user_email + '\n' +
                    transfer.from + ' - ' +
                    transfer.to + '\n' +
                    date + ' ' +
                    time + '\n' +
                    'Дорослих: ' + adult + ' Дітей: ' + children + '\n' +
                    'Спорядження: ' + varArr[`${equip}`] +
                    ' Дитячих крісел: ' + equip_child +
                    ' Тип: ' + varArr[`${type}`] + '\n' +
                    'Статус: ' + varArr['reserv'] + ' ' +
                    ' Вартість: ' + transfer.price + '\n' +
                    'Час бронювання: ' + date.show('yyyy-mm-dd hh:mi');
                telegram.botMessage(telegramOrder, 'orders');
                return 'Order created!';
            });
    };

    async orderstatus(req, res) {
        const status = (req.body.param === 'proof' || req.body.param === 'del') ? req.body.param : 'reserv';
        return query(`UPDATE orders SET status='${status}' WHERE orders='${req.body.id}'`)
            .then((result) => 'Status saved!');
    };

    async list(req, res) {
        let sql = '', countsql = '';
        const user = req.user[0];
        const page = (req.body.page && !isNaN(req.body.page)) ? req.body.page : 1;
        const limit = (req.body.numb && ['100', '50', '30', '2', '5'].includes(req.body.numb)) ? req.body.numb : 30;
        const start_page = (page -1) * limit;
        if (user.permission === 1) {
            let where = '', statussql = '', datesql = '';
            const status = ['reserv', 'proof', 'del'].includes(req.body.param[0]['status']) ? req.body.param[0]['status'] : '';
            const date_count = ['', '3', '6', '12'].includes(req.body.param[1]['date']) ? req.body.param[1]['date'] : '3';
            if (date_count !== '') {
                where = ' WHERE ';
                const present_date = date.show('yyyy-mm-dd hh:mi');
                const date_now = new Date();
                date_now.setMonth(date_now.getMonth() - +date_count);
                const next_date = date.show('yyyy-mm-dd hh:mi', date_now);
                datesql = `book_date>'${next_date}' AND book_date<'${present_date}'`;
            };
            if (status !== '' && date_count !== '') {
                statussql = `AND status='${status}'`;
            };
            if (status !== '' && date_count === '') {
                where = ' WHERE ';
                statussql = `status='${status}'`;
            };
            countsql = `SELECT COUNT(*) FROM orders
                ${where}${datesql}${statussql}`;
            sql = `SELECT * FROM orders
                ${where}${datesql}${statussql} ORDER BY id DESC LIMIT ${start_page}, ${limit}`;
        } else {
            countsql = `SELECT COUNT(*) FROM orders
                WHERE user_id='${user.userid}' OR user_email='${user.email}'`;
            sql = `SELECT * FROM orders
                WHERE user_id='${user.userid}' OR user_email='${user.email}'
                ORDER BY id DESC LIMIT ${start_page}, ${limit}`;
        };
        const {towns_from, towns_to, transfers_arr} = await townsService.townNames(req, res);
        const count_records = await query(countsql).then((result) => result[0]['COUNT(*)']);
        return await query(sql)
        .then((result) => {
            result.forEach(element => {
                element.settings = (user.permission === 1) ? 'true' : 'false';
                transfers_arr.forEach(el => {
                    if (el.transfer_id === element.transfer_id) {
                        element.order_from = towns_from[el.transfer_from];
                        element.order_to = towns_to[el.transfer_to];
                    };
                });
                element.proof = element.status;
            });
            return {'count': count_records, 'list': result};
        })
    };
}

module.exports = new OredersServise();