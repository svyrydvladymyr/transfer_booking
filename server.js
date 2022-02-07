const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const DB = require('./db/createDB');
// DB.users();
// DB.transfers();
// DB.orders();
// DB.points();
// DB.feedback();

const {log, accessLog, logOut} = require('./modules/service');
const renderPage = require('./modules/renderPage');
const {townadd, townlist, transferadd, transferlist, variables, orders, orderslist, saveposition, orderstatus, sendfeedback, feedbacklist, sendanswer} = require('./modules/requestsDB');

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const bot = new ViberBot({
	authToken: '4eb4f438a427dd57-70770adb3ea17ac5-589c8791b4fcb1e4',
	name: "Transfer Bookinggg",
    avatar: "http://viber.com/avatar.jpg"
});
bot.onError(err => console.log(err));
bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));

bot.onSubscribe(response => bot.getUserDetails(response.userProfile)
        .then(userDetails => console.log(userDetails)));

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
app.use((req, res, next) => {log(`URL-REQUEST:-(${req.method})-`, req.url); next();});

//system logs
// app.use((req, res, next) => {accessLog(req, res, next)});

//requests feedback
app.use('/sendfeedback', (req, res) => {sendfeedback(req, res)});
app.use('/feedbacklist', (req, res) => {feedbacklist(req, res)});
app.use('/sendanswer', (req, res) => {sendanswer(req, res)});
//requests order
app.use('/order', (req, res) => {orders(req, res)});
app.use('/orderslist', (req, res) => {orderslist(req, res)});
app.use('/orderproof', (req, res) => {orderstatus(req, res)});
app.use('/orderdel', (req, res) => {orderstatus(req, res)});
//requests variables
app.use('/variables', (req, res) => {variables(req, res)});
//requests saveposition
app.use('/saveposition', (req, res) => {saveposition(req, res)});
//requests towns
app.use('/townadd', (req, res) => {townadd(req, res)});
app.use('/townedit', (req, res) => {townadd(req, res)});
app.use('/towndel', (req, res) => {townadd(req, res)});
app.use('/townlist', (req, res) => {townlist(req, res)});
//requests transfers
app.use('/transferadd', (req, res) => {transferadd(req, res)});
app.use('/transferedit', (req, res) => {transferadd(req, res)});
app.use('/transferdel', (req, res) => {transferadd(req, res)});
app.use('/transferlist', (req, res) => {transferlist(req, res)});


//pages
app.get('/home', (req, res) => {renderPage(req, res, 'home')});
app.get('/about', (req, res) => {renderPage(req, res, 'about')});
app.get('/transfer', (req, res) => {renderPage(req, res, 'transfer')});
app.get('/contacts', (req, res) => {renderPage(req, res, 'contacts')});
app.get('/person', (req, res) => {renderPage(req, res, 'person')});
app.get('/advantages', (req, res) => {renderPage(req, res, 'advantages')});

//logout
app.post('/exit', (req, res) => {logOut(req, res)});

app.get('/', (req, res) => {renderPage(req, res, 'home')});
app.get('*', (req, res) => {res.status(404).send(require('./config/404'));});

//server listen
app.listen(8054, () => {console.log('Server is running...')});

