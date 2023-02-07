require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const botService = require('./botService');
const TelegramApi = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramApi(token, {polling: true});

const userId = +process.env.USER_ID;
const botId = +process.env.BOT_ID;

class BotController {
    botCreating() {
        bot.on('message', async mess => {
            (mess.from.id !== userId)
                ? await botService.unauthorizedUser(mess, bot)
                : (mess.from.id === userId)
                    && (
                        await botService.setMenu(mess, bot, userId),
                        await botService.feedbackAnswer(mess, bot, userId, botId)
                    );
        });
        bot.on('callback_query', async btn => {
            (btn.from.id === userId)
                && await botService.subButton(btn, bot, userId);
        });
        bot.on("polling_error", console.log);
    };

    async botMessage(message, params) {
        await botService.botMessage(message, params, bot, userId);
    };
}

module.exports = new BotController();