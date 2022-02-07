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

const {log, accessLog, logOut, userAutorisation, userPermission} = require('./modules/service');
const renderPage = require('./modules/renderPage');
const {town, townlist, transfer, transferlist, variables, orders, OFlist, saveposition, orderstatus, sendfeedback, sendanswer} = require('./modules/requestsDB');

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
app.post('/feedbacklist', userAutorisation, OFlist);
app.post('/sendanswer', userAutorisation, userPermission, sendanswer);
//requests order
app.post('/order', orders);
app.post('/orderslist', userAutorisation, OFlist);
app.post('/orderstatus', userAutorisation, userPermission, orderstatus);
//requests variables
app.get('/variables', variables);
//requests saveposition
app.post('/saveposition', userAutorisation, userPermission, saveposition);
//requests towns
app.post('/town', userAutorisation, userPermission, town);
app.get('/townlist', userAutorisation, userPermission, townlist);
//requests transfers
app.post('/transfer', userAutorisation, userPermission, transfer);
app.get('/transferlist', userAutorisation, userPermission, transferlist);

//pages
app.get('/home', (req, res) => {renderPage(req, res, 'home')});
app.get('/about', (req, res) => {renderPage(req, res, 'about')});
app.get('/transfer', (req, res) => {renderPage(req, res, 'transfer')});
app.get('/contacts', (req, res) => {renderPage(req, res, 'contacts')});
app.get('/person', (req, res) => {renderPage(req, res, 'person')});
app.get('/advantages', (req, res) => {renderPage(req, res, 'advantages')});

//logout
app.get('/exit', logOut);

app.get('/', (req, res) => {renderPage(req, res, 'home')});
app.get('*', (req, res) => {res.status(404).send(require('./config/404'));});

//server listen
app.listen(8054, () => {console.log('Server is running...')});