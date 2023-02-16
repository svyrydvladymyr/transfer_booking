const {readyFullDate, query} = require('../service');
const fs = require('fs');
const menu_options = {
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
    },
    btn: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Підтвердити', callback_data: `proof`}, {text: 'Скасувати', callback_data: `del`}]
            ]
        })
    }
};
const menu_list = {
    submenu: {
        'Показати відгуки без відповіді' : 'noanswer',
        '5 останніх відгуків' : '5',
        '10 останніх відгуків' : '10',
        '20 останніх відгуків' : '20',
        'Показати непідтверджені замовлення' : 'reserv',
        '5 останніх замовлень' : '5',
        '10 останніх замовлень' : '10',
        '20 останніх замовлень' : '20',
        'btn' : {
            'feedback' : {},
            'orders' : menu_options['btn']
        }
    },
    main: {
        'feedbacks' : 'feedbacks',
        'orders' : 'orders',
        'menu' : 'menu',
        'Відгуки' : 'feedbacks',
        'Замовлення' : 'orders',
        'МЕНЮ' : 'menu'
    }
};
const varArr = {
    'yes': 'Так',
    'no': 'Ні',
    'pr': 'Приватний',
    'gr': 'Груповий',
    'reserv': 'Зарезервовано',
    'del': 'Скасовано',
    'proof': 'Підтверджено',
};

class BotService {
    async queryToDB(limit, type) {
        const mess_type = (type ==='orders') ? 'Замовлень' : 'Відгуків';
        const parameters = (limit === 'noanswer' || limit === 'reserv')
            ? {sql: `SELECT * FROM ${type} WHERE status='${limit}'`,
               message: `${mess_type} без відповіді немає!`}
            : {sql: `SELECT * FROM ${type} ORDER BY id DESC LIMIT ${limit}`,
               message: `${mess_type} ще немає!`};
        return await query(parameters['sql'])
            .then(result => {
                if (result.length === 0) {
                    return [parameters['message']]
                } else {
                    return result.map(el => {
                        if (type === 'feedback') {
                            return `Feedback ID: ${el.idfeedback}
                                ${el.feedbackSurname} ${el.feedbackName}
                                Tel: ${el.feedbackPhone}
                                Email: ${el.feedbackEmail}
                                Date: ${readyFullDate(el.date_create)}
                                Mess: ${el.feedbackComment}
                                Answer: ${el.answer}`;
                        } else if (type === 'orders') {
                            return `Order ID: ${el.orders}
                                ${el.user_surname} ${el.user_name}
                                Tel: ${el.user_tel}
                                Email: ${el.user_email}
                                ${el.order_from} ${el.order_to}
                                ${el.date} ${el.time}
                                Дорослих: ${el.adult} Дітей: ${el.children}
                                Спорядження: ${varArr[`${el.equip}`]} Дитячих крісел: ${el.equip_child} Тип: ${varArr[`${el.type}`]}
                                Статус: ${varArr[`${el.status}`]} Вартість: ${el.sum}
                                Час бронювання: ${el.book_date}`;
                        }
                    })
                }
            })
    };

    async setMenu(mess, bot, userId) {
        bot.setMyCommands([
            {command: '/menu', description: 'Головне меню'},
            {command: '/orders', description: 'Меню замовлень'},
            {command: '/feedbacks', description: 'Меню відгуків'}
        ]);
        const comand_menu = `${mess.text}`.replace('/', '');
        const menu = Object.keys(menu_list['main']);
        const submenu = Object.keys(menu_list['submenu']);
        if (submenu.includes(comand_menu)) {
            const type = (comand_menu.includes('відгук')) ? 'feedback' : 'orders';
            const submenu_res = await this.queryToDB(`${menu_list.submenu[comand_menu]}`, type);
            submenu_res.forEach(el => {
                bot.sendMessage(
                    userId,
                    el.replace(/  /g, ''),
                    ['5', '10', '20'].includes(menu_list.submenu[comand_menu]) ? menu_list.submenu.btn[type] : {}
                );
            });
        };
        if (menu.includes(comand_menu)) {
            bot.sendMessage(userId, comand_menu, menu_options[menu_list['main'][comand_menu]]);
        };
        if (![...submenu, ...menu].includes(comand_menu) && mess.reply_to_message === undefined) {
            bot.sendMessage(userId, `Такої команди не існує!`);
        };
    };

    async feedbackAnswer(mess, bot, userId, botId) {
        const reply = mess.reply_to_message;
        if (reply !== undefined && reply.from.id === botId) {
            const text = reply.text.split("\n")[0].replace('Feedback ID: ', '');
            const answer_text = mess.text;
            let sql = `UPDATE feedback
                SET status='answer', answer='${answer_text}', date_answer='${readyFullDate(new Date(reply.date * 1000))}'
                WHERE idfeedback='${text}'`;
            await query(sql)
                .then(result =>
                    (result.affectedRows === 0)
                        ? bot.sendMessage(userId, `Неможливо зберегти відповідь на відгук, тому що такого відгуку не знайдено!`)
                        : bot.sendMessage(userId, `Відповідь на відгук добавлено!`));
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
                console.log('Telegram-error:', error);
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

    async botMessage(message, params, bot, userId) {
        bot.sendMessage(userId, `${message}`, menu_list.submenu.btn[params]);
    };

}

module.exports = new BotService();