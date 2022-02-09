const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cookieParser = require('cookie-parser')();
require('dotenv').config();

const DB = require('./db/createDB');
// DB.users();
// DB.transfers();
// DB.orders();
// DB.points();
// DB.feedback();

const {log, accessLog, logOut, autorisation, permission} = require('./modules/service');
const renderPage = require('./modules/renderPage');
const {town, townlist, transfer, transferlist, variables, orders, OFlist, saveposition, orderstatus, sendfeedback, sendanswer} = require('./modules/requestsDB');


// const ViberBot = require('viber-bot').Bot;
// const webhookUrl = process.env.WEBHOOK_URL;
// const bot = new ViberBot({
// 	authToken: process.env.VIBER_TOKEN,
// 	name: "Transfer Bookinggg",
//     avatar: "http://viber.com/avatar.jpg"
// });
// app.use("/viber/webhook", bot.middleware());

const viberBot = require('./modules/bot.js')
app.use('/viber/webhook', viberBot.middleware());

const TextMessage = require('viber-bot').Message.Text;
viberBot.onTextMessage(/^hi|hello$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${viberBot.name}`)));

viberBot.onError(err => console.log('eee', err));
viberBot.onSubscribe(response => console.log(`Subscribed: ${response.userProfile.name}`));

//oaugh
require('./modules/oaugh.js')(app);

//template engineer
app.set('views', __dirname + '/templates'); 
app.set('view engine', 'ejs');

//static files
app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.json());

//console logs
app.use((req, res, next) => {log(`URL-REQUEST:-(${req.method})-`, req.url); next()});

//system logs
// app.use((req, res, next) => {accessLog(req, res, next)});

//requests feedback
app.post('/sendfeedback', cookieParser, jsonParser, sendfeedback);
app.post('/feedbacklist', cookieParser, jsonParser, autorisation, OFlist);
app.post('/sendanswer', cookieParser, jsonParser, autorisation, permission, sendanswer);
//requests order
app.post('/order', cookieParser, jsonParser, orders);
app.post('/orderslist', cookieParser, jsonParser, autorisation, OFlist);
app.post('/orderstatus', cookieParser, jsonParser, autorisation, permission, orderstatus);
//requests variables
app.get('/variables', cookieParser, jsonParser, variables);
//requests saveposition
app.post('/saveposition', cookieParser, jsonParser, autorisation, permission, saveposition);
//requests towns
app.post('/town', cookieParser, jsonParser, autorisation, permission, town);
app.get('/townlist', cookieParser, jsonParser, autorisation, permission, townlist);
//requests transfers
app.post('/transfer', cookieParser, jsonParser, autorisation, permission, transfer);
app.get('/transferlist', cookieParser, jsonParser, autorisation, permission, transferlist);

//pages
app.get('/', cookieParser, renderPage);
app.get('/home', cookieParser, renderPage);
app.get('/about', cookieParser, renderPage);
app.get('/blog', cookieParser, renderPage);
app.get('/transfer', cookieParser, renderPage);
app.get('/contacts', cookieParser, renderPage);
app.get('/person', cookieParser, renderPage);
app.get('/advantages', cookieParser, renderPage);

//logout
app.get('/exit', logOut);
app.get('/$', (req, res, next) => {res.redirect('/home')});
app.get('*', (req, res) => {res.redirect('/home')});

// // server listen
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
    // viberBot.setWebhook(process.env.WEBHOOK_URL).catch((err) => {
    //     console.log('err', err);
    // });
});
