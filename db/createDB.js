const con = require('./connectToDB').con;

const users = () => {
    const sql = `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        token VARCHAR(30),
        ava VARCHAR(255), 
        name VARCHAR(80) NOT NULL, 
        surname VARCHAR(80) NOT NULL,
        provider VARCHAR(15) DEFAULT '',
        email VARCHAR(80) DEFAULT '',
        phone VARCHAR(20) DEFAULT '',
        phone_code VARCHAR(6) DEFAULT '',
        phone_verified VARCHAR(10) DEFAULT 'noverified',
        permission INT DEFAULT '0',                  
        date_registered DATETIME
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table users created")});
};

const points = () => {
    const sql = `CREATE TABLE points (id INT AUTO_INCREMENT PRIMARY KEY,
        town_id VARCHAR(120) NOT NULL UNIQUE,
        name_uk VARCHAR(95) NOT NULL UNIQUE,    
        name_en VARCHAR(95) NOT NULL UNIQUE,    
        name_ru VARCHAR(95) NOT NULL UNIQUE        
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table points created")});
};

const transfers = () => {
    const sql = `CREATE TABLE transfers (id INT AUTO_INCREMENT PRIMARY KEY,
        transfer_id VARCHAR(20) NOT NULL UNIQUE,
        transfer_from VARCHAR(120) NOT NULL,
        transfer_to VARCHAR(120) NOT NULL,    
        price_pr VARCHAR(7),
        price_gr VARCHAR(7),
        time1 VARCHAR(6),        
        time2 VARCHAR(6),        
        time3 VARCHAR(6),        
        time4 VARCHAR(6),        
        time5 VARCHAR(6),        
        time6 VARCHAR(6),        
        time7 VARCHAR(6),        
        time8 VARCHAR(6),        
        time9 VARCHAR(6),        
        time10 VARCHAR(6),
        selection VARCHAR(10),   
        privat VARCHAR(10),   
        microbus VARCHAR(10)   
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table tripslist created")});
};

const orders = () => {
    const sql = `CREATE TABLE orders (id INT AUTO_INCREMENT PRIMARY KEY,
        orders VARCHAR(10) NOT NULL,
        transfer_id VARCHAR(50) NOT NULL,
        order_from VARCHAR(100) NOT NULL,
        order_to VARCHAR(100) NOT NULL,
        date VARCHAR(10) NOT NULL,
        time VARCHAR(5) NOT NULL,
        type VARCHAR(2) NOT NULL,
        adult INT NOT NULL,
        children INT,
        equip_child INT,
        equip VARCHAR(3),
        user_name VARCHAR(30),
        user_surname VARCHAR(30),
        user_email VARCHAR(110),
        user_tel VARCHAR(20),
        status VARCHAR(10),
        sum INT,
        paid VARCHAR(10),
        book_date  VARCHAR(20)
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table orders created")});
};


module.exports = {
    users,
    transfers,
    points,
    orders
};