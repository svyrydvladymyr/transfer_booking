const tables = {
    users: `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        token VARCHAR(30),
        ava VARCHAR(255),
        name VARCHAR(80) NOT NULL,
        surname VARCHAR(80) NOT NULL,
        provider VARCHAR(15) DEFAULT '',
        email VARCHAR(110) DEFAULT '',
        phone VARCHAR(20) DEFAULT '',
        phone_code VARCHAR(6) DEFAULT '',
        phone_verified VARCHAR(10) DEFAULT 'noverified',
        permission INT DEFAULT '0',
        date_registered DATETIME
        )`,
    points: `CREATE TABLE points (id INT AUTO_INCREMENT PRIMARY KEY,
        town_id VARCHAR(120) NOT NULL UNIQUE,
        name_uk VARCHAR(95) NOT NULL UNIQUE,
        name_en VARCHAR(95) NOT NULL UNIQUE,
        name_ru VARCHAR(95) NOT NULL UNIQUE
        )`,
    transfers: `CREATE TABLE transfers (id INT AUTO_INCREMENT PRIMARY KEY,
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
        microbus VARCHAR(10),
        CONSTRAINT UNIQUE_Field UNIQUE (transfer_from,transfer_to)
        )`,
    orders: `CREATE TABLE orders (id INT AUTO_INCREMENT PRIMARY KEY,
        orders VARCHAR(10) NOT NULL,
        user_id VARCHAR(60),
        transfer_id VARCHAR(50) NOT NULL,
        order_from VARCHAR(100) NOT NULL,
        order_to VARCHAR(110) NOT NULL,
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
        )`,
    feedback: `CREATE TABLE feedback (id INT AUTO_INCREMENT PRIMARY KEY,
        idfeedback VARCHAR(10) NOT NULL UNIQUE,
        user_id VARCHAR(60),
        feedbackName VARCHAR(80) NOT NULL,
        feedbackSurname VARCHAR(80) NOT NULL,
        feedbackEmail VARCHAR(110) NOT NULL,
        feedbackPhone VARCHAR(20) NOT NULL,
        feedbackComment VARCHAR(310) NOT NULL,
        date_create DATETIME,
        status VARCHAR(10) DEFAULT 'noanswer',
        answer VARCHAR(310) DEFAULT '',
        date_answer DATETIME
        )`,
    blog: `CREATE TABLE blog (id INT AUTO_INCREMENT PRIMARY KEY,
        id_blog VARCHAR(10) NOT NULL UNIQUE,
        alias VARCHAR(265) NOT NULL,
        title VARCHAR(265) NOT NULL,
        description VARCHAR(705) NOT NULL,
        cover VARCHAR(250) DEFAULT 'none',
        article MEDIUMTEXT,
        date_create DATETIME,
        date_update DATETIME
        )`,
    unique_field: `ALTER TABLE transfers
    ADD CONSTRAINT UNIQUE_Fields UNIQUE (transfer_from,transfer_to);`
};

const access_rule = {
    admin: `UPDATE users SET permission='1' WHERE email='ssvyrydvladymyr@gmail.com'`
};

class CreteTables {
    constructor(con){ this.con = con }
    table(table_name) {
        this.con.query( tables[table_name],
            function (error, result) {
                error
                    ? console.log(`ERROR: ${error.sqlMessage}`)
                    : console.log(`Table ${table_name} created!`);
            }
        );
    };
    rule(access_name) {
        this.con.query( access_rule[access_name],
            function (error, result) {
                error
                    ? console.log(`ERROR: ${error.sqlMessage}`)
                    : console.log(`Rule ${access_name} added!`);
            }
        );
    };
};

module.exports = new CreteTables(require('./connectDB').con);