const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
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

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const bot = new ViberBot({
	authToken: process.env.VIBER_TOKEN,
	name: "Transfer Bookinggg",
    avatar: "http://viber.com/avatar.jpg"
});
bot.onError(err => console.log(err));
bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));

app.use("/viber/webhook", bot.middleware());

bot.onSubscribe(
    response => bot.getUserDetails(response.userProfile)
    .then(userDetails => console.log(userDetails))
);

bot.onTextMessage(/^hi|hello$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}`)));

// const TextMessage = require('viber-bot').Message.Text;

// bot.onTextMessage(/^hi|hello$/i, (message, response) =>
//     response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}`)));

//oaugh
require('./modules/oaugh.js')(app);

//template engineer
app.set('views', __dirname + '/templates'); 
app.set('view engine', 'ejs');

//static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//console logs
app.use((req, res, next) => {log(`URL-REQUEST:-(${req.method})-`, req.url); next()});

//system logs
// app.use((req, res, next) => {accessLog(req, res, next)});

//requests feedback
app.post('/sendfeedback', sendfeedback);
app.post('/feedbacklist', autorisation, OFlist);
app.post('/sendanswer', autorisation, permission, sendanswer);
//requests order
app.post('/order', orders);
app.post('/orderslist', autorisation, OFlist);
app.post('/orderstatus', autorisation, permission, orderstatus);
//requests variables
app.get('/variables', variables);
//requests saveposition
app.post('/saveposition', autorisation, permission, saveposition);
//requests towns
app.post('/town', autorisation, permission, town);
app.get('/townlist', autorisation, permission, townlist);
//requests transfers
app.post('/transfer', autorisation, permission, transfer);
app.get('/transferlist', autorisation, permission, transferlist);

//pages
// app.get('/', renderPage);
app.get('/home', renderPage);
app.get('/about', renderPage);
app.get('/transfer', renderPage);
app.get('/contacts', renderPage);
app.get('/person', renderPage);
app.get('/advantages', renderPage);

//logout
app.get('/exit', logOut);
app.get('/$', (req, res, next) => {res.redirect('home')});
app.get('*', (req, res) => {res.redirect('home')});

//server listen
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
    bot.middleware();
});

