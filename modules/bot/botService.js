const {readyFullDate, query} = require('../service');
const fs = require('fs');
const optionsBTN = {
    orders: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: 'Показати непідтверджені замовлення'}],
                [{text: '5 останніх замовлень'}],
                [{text: '10 останніх замовлень'}],
                [{text: '20 останніх замовлень'}],
                [{text: 'МЕНЮ'}],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        })
    },
    feedbacks: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: 'Показати відгуки без відповіді'}],
                [{text: '5 останніх відгуків'}],
                [{text: '10 останніх відгуків'}],
                [{text: '20 останніх відгуків'}],
                [{text: 'МЕНЮ'}],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        })
    },
    menu: {
        reply_markup: {
            keyboard: [
                [{text: 'Замовлення'}],
                [{text: 'Відгуки'}],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    }
};

class BotService {
    async getOrders(param, bot, userId) {
        let sql = '';
        if (param === 'reserv') {
            sql = `SELECT * FROM orders WHERE status='reserv'`;
        };
        if (['5', '10', '20'].includes(param)) {
            sql = `SELECT * FROM orders ORDER BY id DESC LIMIT ${param}`;
        };
        await query(sql)
            .then((result) => {
                if (result.length === 0) {
                    if (param === 'reserv') {
                        return bot.sendMessage(userId, `Не підтверджених замовлень немає!`);
                    };
                    if (['5', '10', '20'].includes(param)) {
                        return bot.sendMessage(userId, `Замовлень ще немає!`);
                    };
                };
                result.forEach(el => {
                    const varArr = {
                        'yes': 'Так',
                        'no': 'Ні',
                        'pr': 'Приватний',
                        'gr': 'Груповий',
                        'reserv': 'Зарезервовано',
                        'del': 'Скасовано',
                        'proof': 'Підтверджено',
                    }
                    const telegramOrder = 'Order ID: ' + el.orders + '\n' +
                        el.user_surname + ' ' + el.user_name + '\n' +
                        'Tel: ' + el.user_tel + '\n' +
                        'Email: ' + el.user_email + '\n' +
                        el.order_from + ' - ' + el.order_to + '\n' +
                        el.date + ' ' + el.time + '\n' +
                        'Дорослих: ' + el.adult + ' Дітей: ' + el.children + '\n' +
                        'Спорядження: ' + varArr[`${el.equip}`] + ' Дитячих крісел: ' + el.equip_child + ' Тип: ' + varArr[`${el.type}`] + '\n' +
                        'Статус: ' + varArr[`${el.status}`] + ' ' + ' Вартість: ' + el.sum + '\n' +
                        'Час бронювання: ' + el.book_date;
                    bot.sendMessage(userId, telegramOrder, {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{text: 'Підтвердити', callback_data: `proof`}, {text: 'Скасувати', callback_data: `del`}]
                            ]
                        })
                    });
                })
            })
            .catch((error) => {
                console.log('order-telegram-error', error);
                bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
            });
    };

    async getFeedbacks(param, bot, userId) {
        let sql = '';
        if (param === 'noanswer') {
            sql = `SELECT * FROM feedback WHERE status='noanswer'`;
        };
        if (['5', '10', '20'].includes(param)) {
            sql = `SELECT * FROM feedback ORDER BY id DESC LIMIT ${param}`;
        };
        await query(sql)
            .then((result) => {
                if (result.length === 0) {
                    if (param === 'noanswer') {
                        return bot.sendMessage(userId, `Вдгуків без відповіді немає!`);
                    };
                    if (['5', '10', '20'].includes(param)) {
                        return bot.sendMessage(userId, `Вдгуків ще немає!`);
                    };
                };
                result.forEach(el => {
                    const telegramFeedback = 'Feedback ID: ' + el.idfeedback + '\n' +
                        el.feedbackSurname + ' ' + el.feedbackName + '\n' +
                        'Tel: ' + el.feedbackPhone + '\n' +
                        'Email: ' + el.feedbackEmail + '\n' +
                        'Date: ' + readyFullDate(el.date_create) + '\n' +
                        'Mess: ' + el.feedbackComment + '\n' +
                        'Answer: ' + el.answer;
                    bot.sendMessage(userId, telegramFeedback);
                });
            })
            .catch((error) => {
                console.log('feedback-telegram-error', error);
                bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
            });
    };

    async unauthorizedUser(mess, bot) {
        const telegram_id = `--TELEGRAM_USER_ID-->> TIME: ${new Date().toLocaleString()} - ID: ${mess.from.id}\n`;
        console.log(telegram_id);
        fs.appendFile(`./log/telegram_log.txt`, telegram_id,
            error => error ? console.log(error) : null
        );
        bot.setMyCommands([{command: '/start', description: 'start'}]);
        return bot.sendMessage(mess.from.id, `Приватний БОТ!`);
    };

    async setMenu(mess, bot, userId) {
        const comand = `${mess.text}`;
        bot.setMyCommands([
            {command: '/menu', description: 'Головне меню'},
            {command: '/orders', description: 'Меню замовлень'},
            {command: '/feedbacks', description: 'Меню відгуків'}
        ]);
        const comand_menu = comand.replace('/', '');
        const submenu_obj_feedbacks = {
            'Показати відгуки без відповіді' : 'noanswer',
            '5 останніх відгуків' : '5',
            '10 останніх відгуків' : '10',
            '20 останніх відгуків' : '20'
        };
        const submenu_obj_orders = {
            'Показати непідтверджені замовлення' : 'reserv',
            '5 останніх замовлень' : '5',
            '10 останніх замовлень' : '10',
            '20 останніх замовлень' : '20'
        };
        const menu_obj = {
            'feedbacks' : 'feedbacks',
            'orders' : 'orders',
            'menu' : 'menu',
            'Відгуки' : 'feedbacks',
            'Замовлення' : 'orders',
            'МЕНЮ' : 'menu'
        };
        const submenu_arr_feedbacks = Object.keys(submenu_obj_feedbacks);
        const submenu_arr_orders = Object.keys(submenu_obj_orders);
        const menu_arr = Object.keys(menu_obj);
        if (submenu_arr_feedbacks.includes(comand_menu)) {
            this.getFeedbacks(`${submenu_obj_feedbacks[comand_menu]}`, bot, userId);
        };
        if (submenu_arr_orders.includes(comand_menu)) {
            this.getOrders(`${submenu_obj_orders[comand_menu]}`, bot, userId);
        };
        if (menu_arr.includes(comand_menu)) {
            return bot.sendMessage(userId, `${menu_obj[comand_menu]}`, optionsBTN[menu_obj[comand_menu]]);
        };
        if (![...submenu_arr_feedbacks, ...submenu_arr_orders, ...menu_arr].includes(comand_menu) && mess.reply_to_message === undefined) {
            return bot.sendMessage(userId, `Такої команди не існує!`);
        };
    };

    async feedbackAnswer(mess, bot, userId, botId) {
        const reply = mess.reply_to_message;
        if (reply !== undefined && reply.from.id === botId) {
            const text = reply.text.split("\n")[0].replace('Feedback ID: ', '');
            const answer_text = mess.text;
            let sql = `UPDATE feedback SET status='answer', answer='${answer_text}', date_answer='${readyFullDate(new Date(reply.date * 1000))}' WHERE idfeedback='${text}'`;
            await query(sql)
                .then((result) => {
                    return (result.affectedRows === 0)
                        ? bot.sendMessage(userId, `Неможливо зберегти відповідь на відгук, тому що такого відгуку не знайдено!`)
                        : bot.sendMessage(userId, `Відповідь на відгук добавлено!`);
                })
                .catch((err) => {
                    console.log('answer-telegram-error', err);
                    bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
                });
        };
    };

    async subButton(btn, bot, userId) {
        const text = btn.message.text;
        const orderID = text.split("\n")[0].replace('Order ID: ', '');
        const parameter = btn.data;
        const statusArr = {
            'proof': 'підтверджено',
            'del': 'скасовано'
        };
        const sql = `UPDATE orders SET status='${parameter}' WHERE orders='${orderID}'`;
        await query(sql)
            .then((result) => {
                return (result.affectedRows === 0)
                    ? bot.sendMessage(userId, `Неможливо змінити статус, тому що такого замовлення не знайдено!`)
                    : bot.sendMessage(userId, `Статус замовлення змінено на "${statusArr[parameter]}"!`);
            })
            .catch((error) => {
                console.log('order-telegram-error', error);
                bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
            });
    };

    async botMessage(message, params, bot, userId) {
        const message_body = {
            "feedback" : {},
            "order" : {
                reply_markup: JSON.stringify({
                    inline_keyboard: [[{text: 'Підтвердити', callback_data: `proof`}, {text: 'Скасувати', callback_data: `del`}]]
                })
            }
        };
        bot.sendMessage(userId, `${message}`, message_body[params]);
    };

}

module.exports = new BotService();