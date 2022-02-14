const express = require('express');
const app = express();
// const bodyParser = require('body-parser').json();
const jsonParser = require('body-parser').json();
const cookieParser = require('cookie-parser')();

require('dotenv').config();

const telegram = require('./modules/bot');
// telegram.checkID();
telegram.telegramSetMenu();
telegram.telegramPushBTN();
telegram.telegramAnswerfeedback();



const DB = require('./db/createDB');
// DB.users();
// DB.transfers();
// DB.orders();
// DB.points();
// DB.feedback();

const {log, accessLog, logOut, autorisation, permission} = require('./modules/service');
const renderPage = require('./modules/renderPage');
const {town, townlist, transfer, transferlist, variables, orders, OFlist, saveposition, orderstatus, sendfeedback, sendanswer} = require('./modules/requestsDB');

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
});
