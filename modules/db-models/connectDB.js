const mysql = require("mysql");
const con = mysql.createConnection({
    driver: "mysql",
    host: process.env.HostDB,
    user: process.env.UserDB,
    password: process.env.PassDB,
    charset: "utf8",
    collation: "utf8_unicode_ci",
    prefix: "",
    strict: false,
    database: process.env.NameDB
});

con.connect( error => {
    const errorLog = require('../service').errorLog;
    error
        ? errorLog(error, 'db', 'Error DB connect')
        : console.log("\u001b[36mThe connection to the database is established!\u001b[0m")
});

setInterval(function () {
    con.query("SELECT 1") }, 20000
);

module.exports = { con };