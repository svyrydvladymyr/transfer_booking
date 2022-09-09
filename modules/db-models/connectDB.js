require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const mysql = require("mysql");
const con = mysql.createConnection({
    driver: "mysql",
    host: "localhost",
    user: process.env.UserDB,
    password: process.env.PassDB,
    charset: "utf8",
    collation: "utf8_unicode_ci",
    prefix: "",
    strict: false,
    database: process.env.NameDB
});

con.connect((err) => {if (err) { console.log("Error connecting to DB:", err) }});
setInterval(function () { con.query("SELECT 1") }, 20000);
module.exports = { con };