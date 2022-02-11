require('dotenv').config();
const con = require('../db/connectToDB').con;
const TelegramApi = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramApi(token, {polling: true});

const chatId = '5289170295';
const fromId = '5184949371';

const optionsBTN = {
    menu: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Замовлення', callback_data: 'orders'}],
                [{text: 'Відгуки', callback_data: 'feedbacks'}],
            ]
        })
    }
}

const telegramSetMenu = () => {
    bot.setMyCommands([
        {command: '/menu', description: 'Головне меню'},
        {command: '/orders', description: 'Показати непідтверджені замовлення'},
        {command: '/feedbacks', description: 'Показати непрочитані відгуки'}
    ]);
    bot.on('message', mess => {
        console.log('mess', mess);


        const comand = mess.text;
        if (mess.text.includes('/')) {
            if (['/start', '/menu'].includes(comand)) {
                return bot.sendMessage(chatId, `МЕНЮ`, optionsBTN.menu);
            }
            return bot.sendMessage(chatId, `Такої команди не існує!`);
        };
    });
};

const telegramSendfeedback = (text) => { bot.sendMessage(chatId, `${text}`) };
const telegramAnswerfeedback = (text) => {

        // bot.sendMessage(chatId, `${text}`);

    bot.on('message', mess => {
        const text = mess.text;
        const messId = mess.message_id;
        const reply = mess.reply_to_message;


        console.log('text', text);
        console.log('chatId', chatId);
        console.log('messId', messId);
        console.log('date', new Date(mess.date * 1000));
        console.log('reply', reply);


    });
};
const telegramPushBTN = () => {
    bot.on('callback_query', btn => {
        console.log('btn', btn);



    })
} 



module.exports = {
    telegramSetMenu, 
    telegramSendfeedback,
    telegramAnswerfeedback,
    telegramPushBTN
}



