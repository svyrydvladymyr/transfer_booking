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
app.get('/home', renderPage);
app.get('/about', renderPage);
app.get('/transfer', renderPage);
app.get('/contacts', renderPage);
app.get('/person', renderPage);
app.get('/advantages', renderPage);

//logout
app.get('/exit', logOut);

app.get('/', renderPage);
app.get('*', (req, res) => {res.status(404).send(require('./config/404'));});

//server listen
app.listen(8054, () => {console.log('Server is running...')});