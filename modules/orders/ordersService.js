const telegram = require('../bot/botController');
const {query, checOnTrueVal, readyFullDate, token, clienttoken} = require('../service');
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
                }
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
                '${checOnTrueVal(transferId)}',
                '${transfer.from}',
                '${transfer.to}',
                '${adult}',
                '${children}',
                '${type}',
                '${date.replace(new RegExp("[^0-9]//", "gi"), "")}',
                '${time.replace(new RegExp("[^0-9]:", "gi"), "")}',
                '${equip.replace(new RegExp("[^a-z]", "gi"), "")}',
                '${equip_child}',
                '${checOnTrueVal(user_name)}',
                '${checOnTrueVal(user_surname)}',
                '${user_email.replace(new RegExp("[^a-zA-Z0-9.&@-_]", "gi"), "")}',
                '${user_phone.replace(new RegExp("[^0-9+]", "gi"), "")}',
                'reserv',
                'no',
                '${transfer.price}',
                '${readyFullDate(new Date(), "")}')`;
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
                    'Час бронювання: ' + readyFullDate(new Date(), '');
                telegram.botMessage(telegramOrder, 'orders');
                return 'Order created!';
            });
    };

    async orderstatus(req, res) {
        const status = (req.body.param === 'proof' || req.body.param === 'del') ? req.body.param : 'reserv';
        return query(`UPDATE orders SET status='${status}' WHERE orders='${req.body.id}'`)
            .then((result) => 'Status saved!');
    };



}

module.exports = new OredersServise();