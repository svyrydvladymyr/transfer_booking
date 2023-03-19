const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

//routers
const renderPage = require('./modules/pages/pagesController');
const towns = require('./modules/towns/routers');
const transfers = require('./modules/transfers/routers');
// const orderss = require('./modules/orders/routers');

// creating DB tables
// const tables = require('./modules/db-models/createDB');
// tables.table('blog');

const {autorisation, permission} = require('./modules/service');

const {variables, orders, OFlist, orderstatus, sendfeedback, sendanswer, news} = require('./modules/requestsDB');

//oaugh
const oaugh = require('./modules/oauth/oauthController.js');
oaugh.initialize(app);
oaugh.autorisation(app, 'google');
oaugh.autorisation(app, 'facebook');

//telegram bot
const telegram = require('./modules/bot/botController');
telegram.botCreating();

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
app.use((req, res, next) => {console.log(`-URL-REQUEST:-(${req.method})--->`, req.url); next()});

//requests news
app.post('/fotonews', news);

//requests feedback
app.post('/sendfeedback', sendfeedback);
app.post('/feedbacklist', autorisation, OFlist);
app.post('/sendanswer', autorisation, permission, sendanswer);

//requests variables
app.get('/variables', variables);

//requests
app.use('/towns', autorisation, permission, towns);
app.use('/transfers', autorisation, permission, transfers);
// app.use('/orders', autorisation, permission, orderss);





//requests order
app.post('/order', orders);
app.post('/orderslist', autorisation, OFlist);
app.post('/orderstatus', autorisation, permission, orderstatus);


//pages
app.get('/', renderPage.userData);
app.get('/home', renderPage.userData);
app.get('/about', renderPage.userData);
app.get('/blog', renderPage.userData);
app.get('/transfer', renderPage.userData);
app.get('/contacts', renderPage.userData);
app.get('/person', renderPage.userData);
app.get('/advantages', renderPage.userData);
app.get('/privacy-policy', renderPage.userData);


//redirect to home page
app.get('/$', (req, res, next) => {res.redirect('/home')});
app.get('*', (req, res) => {res.redirect('/home')});

//creating server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    error
        ? console.log('\u001b[31mServer ERROR:\u001b[0m', error)
        : console.log(`\u001b[36mServer is running at \u001b[33m${PORT}\u001b[0m \u001b[36mport!\u001b[0m` );
});


