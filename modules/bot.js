require('dotenv').config();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const bot = new ViberBot({
    authToken: process.env.VIBER_TOKEN, 
    name: "Bot Name",
    avatar: "" 
});

bot.onSubscribe(response => {
   console.log('onSubscribe', response);
});

bot.on(BotEvents.CONVERSATION_STARTED, (response) => {
    console.log('CONVERSATION_STARTED', response);
})
bot.on(BotEvents.MESSAGE_SENT, (message, userProfile) => {
    console.log('ffffffffffffffffff', message);
} );

module.exports = bot;
