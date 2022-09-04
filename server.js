const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });


//routers
const towns = require('./modules/towns/routers');
// const multer  = require('multer');
// const fs = require('fs');

// require('./modules/db-models/createDB').table('users');

const {log, logOut, autorisation, permission} = require('./modules/service');
const renderPage = require('./modules/renderPage');
const {transfer, transferlist, variables, orders, OFlist, saveposition, orderstatus, sendfeedback, sendanswer, news} = require('./modules/requestsDB');

//oaugh
require('./modules/oaugh.js')(app);

//telegram bot
const telegram = require('./modules/bot');
// telegram.checkID();
telegram.telegramSetMenu();
telegram.telegramPushBTN();
telegram.telegramAnswerfeedback();

//template engineer
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

//static files
app.use(express.static(__dirname + '/public'));

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

//console logs
app.use((req, res, next) => {log(`URL-REQUEST:-(${req.method})-`, req.url); next()});

//system logs
// app.use((req, res, next) => {accessLog(req, res, next)});

//requests news
app.post('/fotonews', news);
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
app.use('/town', autorisation, permission, towns);
// app.post('/town', autorisation, permission, town);
// app.get('/townlist', autorisation, permission, townlist);

//requests transfers
app.post('/transfer', autorisation, permission, transfer);
app.get('/transferlist', autorisation, permission, transferlist);

//pages
app.get('/', renderPage);
app.get('/home', renderPage);
app.get('/about', renderPage);
app.get('/blog', renderPage);
app.get('/transfer', renderPage);
app.get('/contacts', renderPage);
app.get('/person', renderPage);
app.get('/advantages', renderPage);
app.get('/privacy-policy', renderPage);

//logout
app.get('/exit', logOut);

//redirect to home page
app.get('/$', (req, res, next) => {res.redirect('/home')});
app.get('*', (req, res) => {res.redirect('/home')});

//creating server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    error
        ? console.log('Server ERROR...:', error)
        : console.log(`Server is running at ${PORT} port...`);
});


