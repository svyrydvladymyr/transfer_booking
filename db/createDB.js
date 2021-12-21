const con = require('./connectToDB').con;

const users = () => {
    const sql = `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        token VARCHAR(30),
        ava VARCHAR(255), 
        name VARCHAR(80) NOT NULL, 
        surname VARCHAR(80) NOT NULL,
        email VARCHAR(80) DEFAULT '',
        permission INT DEFAULT '0',                  
        date_registered DATETIME
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table users created")});
};

const points = () => {
    const sql = `CREATE TABLE points (id INT AUTO_INCREMENT PRIMARY KEY,
        id INT NOT NULL,
        name_ua VARCHAR(50) NOT NULL,    
        name_en VARCHAR(50) NOT NULL,    
        name_ru VARCHAR(50) NOT NULL         
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table points created")});
};

const tripslist = () => {
    const sql = `CREATE TABLE tripslist (id INT AUTO_INCREMENT PRIMARY KEY,
        from INT NOT NULL,
        to INT NOT NULL,    
        price_private INT NOT NULL,  
        price_group INT NOT NULL          
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table tripslist created")});
};

const user_trips = () => {
    const sql = `CREATE TABLE user_trips (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL,
        from INT NOT NULL,
        to INT NOT NULL, 
        trip_date DATE NOT NULL, 
        trip_time TIME NOT NULL, 
        transfer_options VARCHAR(30) NOT NULL, 
        adults INT,
        children INT,
        children INT,
        sky_equipment VARCHAR(10), 
        date_registered DATETIME
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table user_trips created")});
};


module.exports = {
    users,
    tripslist,
    points,
    user_trips
};