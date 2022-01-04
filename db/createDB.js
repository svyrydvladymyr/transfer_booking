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
        town_id VARCHAR(75) NOT NULL UNIQUE,
        name_ua VARCHAR(55) NOT NULL UNIQUE,    
        name_en VARCHAR(55) NOT NULL UNIQUE,    
        name_ru VARCHAR(55) NOT NULL UNIQUE        
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table points created")});
};

const transfers = () => {
    const sql = `CREATE TABLE transfers (id INT AUTO_INCREMENT PRIMARY KEY,
        transfer_id VARCHAR(20) NOT NULL UNIQUE,
        transfer_from VARCHAR(75) NOT NULL,
        transfer_to VARCHAR(75) NOT NULL,    
        price_pr INT,  
        price_gr INT,  
        time1 TIME,        
        time2 TIME,        
        time3 TIME,        
        time4 TIME,        
        time5 TIME,        
        time6 TIME,        
        time7 TIME,        
        time8 TIME,        
        time9 TIME,        
        time10 TIME
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
    transfers,
    points,
    user_trips
};