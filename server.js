const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logRoute = require("./modules/service").errorLog;

// dotenv
// const dotenv = require("dotenv");
// dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

// creating DB tables
const DB = require('./modules/db-models/createDB');
DB.table('users');
DB.table('points');
DB.table('transfers');
DB.table('orders');
DB.table('feedback');
DB.table('blog');
DB.rule('admin');
DB.news('one');
DB.news('two');
DB.news('three');

//routs
const renderPage = require("./modules/pages/pagesController");
const towns = require("./modules/towns/routers");
const transfers = require("./modules/transfers/routers");
const orders = require("./modules/orders/routers");
const feedbacks = require("./modules/feedbacks/routers");
const news = require("./modules/news/routers");

//oaugh
const oaugh = require("./modules/oauth/oauthController.js");
oaugh.initialize(app);
oaugh.autorisation(app, "google");
// oaugh.autorisation(app, "facebook");

//telegram bot
// const telegram = require("./modules/bot/botController");
// telegram.botCreating();

//template engineer
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//static files
app.use(express.static(__dirname + "/public"));
app.use('/blog', express.static(__dirname + "/public"));

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({limit: "20mb"}));
// app.use(bodyParser.urlencoded({limit: "20mb", extended: true, parameterLimit:20000}));
app.use(cookieParser());

//console logs
app.use((req, res, next) => {
    logRoute(req.url, 'route', `-URL-REQUEST:-(${req.method})---`, req);
    next();
});

//routs
app.use("/towns", towns);
app.use("/transfers", transfers);
app.use("/order", orders);
app.use("/feedback", feedbacks);
app.use("/blog", news);

app.use((req, res, next) => {
    (req.url.slice(-1) === '/' && req.url.length > 1 && !/\?[^]*\//.test(req.url))
        ? res.redirect(301, req.url.slice(0, -1))
        : next();
});

//pages
app.get("/", renderPage.userData);
app.get("/home", renderPage.userData);
app.get("/about", renderPage.userData);
app.get("/transfer", renderPage.userData);
app.get("/contacts", renderPage.userData);
app.get("/person", renderPage.userData);
app.get("/advantages", renderPage.userData);
app.get("/privacy-policy", renderPage.userData);

//redirect to home page
app.get("/$", (req, res, next) => { res.redirect("/home") });
app.get("*", (req, res) => { res.redirect("/home") });

//creating server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {

    console.log('process.env.PORT', process.env.PORT);
    error
        ? console.log("\u001b[31mServer ERROR:\u001b[0m", error)
        : console.log(`\u001b[36mServer is running at \u001b[33m${PORT}\u001b[0m \u001b[36mport!\u001b[0m`);
});