require("dotenv").config({ path: `.${process.env.NODE_ENV}.env` });

const {errorLog} = require('../service');
const botService = require("./botService");
const TelegramApi = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramApi(token, { polling: true });

const userId = +process.env.USER_ID;
const botId = +process.env.BOT_ID;

class BotController {
    botCreating() {
        bot.on("", (mess) => {
            console.log("gggggg", mess);
        });
        bot.on("message", async (mess) => {
            try {
                mess.from.id === userId
                    ? (await botService.setMenu(mess, bot, userId), await botService.feedbackAnswer(mess, bot, userId, botId))
                    : mess.from.id !== userId && (await botService.unauthorizedUser(mess, bot));
            } catch (error) {
                errorLog(error, 'telegram');
                bot.sendMessage(userId, `Сталася помилка! Спробуйте ще раз...`);
            };
        });
        bot.on("callback_query", async (btn) => {
            btn.from.id === userId && (await botService.subButton(btn, bot, userId));
        });
        bot.on("polling_error", (error) => {
            errorLog(error, 'telegram');
        });
    }
    async botMessage(message, params) {
        await botService.botMessage(message, params, bot, userId);
    }
}

module.exports = new BotController();
