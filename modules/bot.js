require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const {readyFullDate, tableRecord, query} = require('./service');


const TelegramApi = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramApi(token, {polling: true});

const userId = +process.env.USER_ID;
const botId = +process.env.BOT_ID;

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

class TelegramBot {
    checkID() {
        bot.on('message', mess => {
            console.log('--TELEGRAM_USER_ID-->>', mess.from.id);
        });
    }

    getOrders(param) {
        let sql = '';
        if (param === 'reserv') {
            sql = `SELECT * FROM orders WHERE status='reserv'`;
        };
        if (['5', '10', '20'].includes(param)) {
            sql = `SELECT * FROM orders ORDER BY id DESC LIMIT ${param}`;
        };
        tableRecord(sql)
        .then((result) => {
            if (result.err) { throw new Error('err-order-list') };
            if (!result.err && result.length === 0) {
                if (param === 'reserv') {
                    return bot.sendMessage(userId, `Не підтверджених замовлень немає!`);
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
            });
        })
        .catch((err) => {
            console.log('order-telegram-error', err);
            bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
        });
    };

    getFeedbacks(param) {
        let sql = '';
        if (param === 'noanswer') {
            sql = `SELECT * FROM feedback WHERE status='noanswer'`;
        };
        if (['5', '10', '20'].includes(param)) {
            sql = `SELECT * FROM feedback ORDER BY id DESC LIMIT ${param}`;
        };
        tableRecord(sql)
        .then((result) => {
            if (result.err) { throw new Error('err-feedback-list') };
            if (!result.err && result.length === 0) {
                if (param === 'noanswer') {
                    return bot.sendMessage(userId, `Вдгуків без відповіді немає!`);
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
        .catch((err) => {
            console.log('feedback-telegram-error', err);
            bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
        });
    };

    telegramSendorder(mess, id) {
        bot.sendMessage(userId, `${mess}`, {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: 'Підтвердити', callback_data: `proof`}, {text: 'Скасувати', callback_data: `del`}]]
            })
        });
    };

    telegramSendfeedback(text) {
        bot.sendMessage(userId, `${text}`)
    };

    telegramAnswerfeedback() {
        bot.on('message', mess => {
            if (mess.from.id === userId) {
                const reply = mess.reply_to_message;
                if (reply !== undefined) {
                    if (reply.from.id === botId) {
                        const text = reply.text.split("\n")[0].replace('Feedback ID: ', '');
                        const answer_text = mess.text;
                        let sql = `UPDATE feedback SET status='answer', answer='${answer_text}', date_answer='${readyFullDate(new Date(reply.date * 1000))}' WHERE idfeedback='${text}'`;
                        tableRecord(sql)
                        .then((result) => {
                            if (result.err) { throw new Error('err-feedback-answer') };
                            if (!result.err && result.affectedRows === 0) {
                                return bot.sendMessage(userId, `Неможливо зберегти відповідь на відгук, тому що такого відгуку не знайдено!`);
                            };
                            return bot.sendMessage(userId, `Відповідь на відгук добавлено!`);
                        })
                        .catch((err) => {
                            console.log('answer-telegram-error', err);
                            bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
                        });
                    };
                };
            };
        });
    };

    telegramSetMenu() {
        bot.on('message', mess => {
            const comand = `${mess.text}`;
            // console.log("userId from mess:--", mess.from.id);
            // console.log("userId:--", userId);
            // console.log("comand:--", comand);
            if (mess.from.id !== userId) {
                bot.setMyCommands([{command: '/start', description: 'start'}]);
                return bot.sendMessage(mess.from.id, `Приватний БОТ!`);
            }
            if (mess.from.id === userId) {
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
                    this.getFeedbacks(`${submenu_obj_feedbacks[comand_menu]}`);
                };
                if (submenu_arr_orders.includes(comand_menu)) {
                    this.getOrders(`${submenu_obj_orders[comand_menu]}`);
                };
                if (menu_arr.includes(comand_menu)) {
                    return bot.sendMessage(userId, `${menu_obj[comand_menu]}`, optionsBTN[menu_obj[comand_menu]]);
                };
                if (![...submenu_arr_feedbacks, ...submenu_arr_orders, ...menu_arr].includes(comand_menu) && mess.reply_to_message === undefined) {
                    return bot.sendMessage(userId, `Такої команди не існує!`);
                }
            };
        });
    };

    telegramPushBTN() {
        bot.on('callback_query', btn => {
            if (btn.from.id === userId) {
                const text = btn.message.text;
                const orderID = text.split("\n")[0].replace('Order ID: ', '');
                const parameter = btn.data;
                const statusArr = {
                    'proof': 'підтверджено',
                    'del': 'скасовано'
                };
                let sql = `UPDATE orders SET status='${parameter}' WHERE orders='${orderID}'`;
                tableRecord(sql)
                .then((result) => {
                    if (result.err) { throw new Error('err-order-answer') };
                    if (!result.err && result.affectedRows === 0) {
                        return bot.sendMessage(userId, `Неможливо змінити статус, тому що такого замовлення не знайдено!`);
                    };
                    return bot.sendMessage(userId, `Статус замовлення змінено на "${statusArr[parameter]}"!`);
                })
                .catch((err) => {
                    console.log('order-telegram-error', err);
                    bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
                });
            };
        });
    };
}

module.exports = new TelegramBot();