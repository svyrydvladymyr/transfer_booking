const {query, checOnTrueVal} = require('../service');

class TownsService {
    async duplicateTowns(error, body) {
        const array_towns = Object.values(body);
        for (let i = 0; i < array_towns.length; i++) {
            if (error.sqlMessage.includes(array_towns[i])) {
                return {"DUP": array_towns[i]};
            };
        };
    }

    async checkValue(body, req, res) {
        return body.uk ? {
            "id": checOnTrueVal(body.id),
            "uk": checOnTrueVal(body.uk),
            "en": checOnTrueVal(body.en),
            "ru": checOnTrueVal(body.ru)
        } : {req, res};
    }

    async create(body) {
        const sql = `INSERT INTO points (town_id, name_uk, name_en, name_ru)
            VALUES ('${body.id}',
                    '${body.uk}',
                    '${body.en}',
                    '${body.ru}')`;
        return await query(sql)
            .then(() => "Town created!")
    }

    async update(body) {
        const sql = `UPDATE points
            SET name_uk='${body.uk}',
                name_en='${body.en}',
                name_ru='${body.ru}'
            WHERE town_id='${body.id}'`;
        return await query(sql)
            .then(() => "Town updated!")
    }

    async delete(body) {
        const sql = `DELETE a.*, b.*
            FROM points a
            LEFT JOIN transfers b
            ON a.town_id = b.transfer_from OR a.town_id = b.transfer_to
            WHERE a.town_id='${body.id}'`;
        return await query(sql)
            .then(() => "Town deleted!");
    }

    async list() {
        const sql = `SELECT * FROM points`;
        return await query(sql)
            .then((result) => result)
    }

    async townNames(req, res) {
        const townsFrom = {}, townsTo = {}, transfersArr = [], townsId = [];
        const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies ? req.cookies['lang'] : undefined)
            ? req.cookies['lang'].slice(0, 2)
            : 'uk';
        const townIdRes = await query(`SELECT town_id, name_${lang} FROM points`);
        const townsFromRes = await query(`SELECT transfer_from FROM transfers GROUP BY transfer_from`);
        const townsToRes = await query(`SELECT transfer_to FROM transfers GROUP BY transfer_to`);
        const transfersArrRes = await query(`SELECT * FROM transfers`);
        townIdRes.forEach(element => { townsId[`${element.town_id}`] = element[`name_${lang}`] });
        townsFromRes.forEach(element => { townsFrom[`${element.transfer_from}`] = townsId[element.transfer_from] });
        townsToRes.forEach(element => { townsTo[`${element.transfer_to}`] = townsId[element.transfer_to] });
        transfersArrRes.forEach(element => { transfersArr.push(element) });
        return {townsFrom, townsTo, transfersArr};

        // return new Promise((resolve) => {
        //     Promise.all([
        //         query(`SELECT town_id, name_${lang} FROM pointss`),
        //         query(`SELECT transfer_from FROM transfers GROUP BY transfer_from`),
        //         query(`SELECT transfer_to FROM transfers GROUP BY transfer_to`),
        //         query(`SELECT * FROM transfers`)])
        //     .then( ([townIdRes, townsFromRes, townsToRes, transfersArrRes]) => {
        //         // if (townIdRes.err) { throw new Error('error-DB-townsID') };
        //         // if (townsFromRes.err) { throw new Error('error-DB-transferFROM') };
        //         // if (townsToRes.err) { throw new Error('error-DB-transferTO') };
        //         // if (transfersArrRes.err) { throw new Error('error-DB-transfersARR') };
        //         townIdRes.forEach(element => { townsId[`${element.town_id}`] = element[`name_${lang}`] });
        //         townsFromRes.forEach(element => { townsFrom[`${element.transfer_from}`] = townsId[element.transfer_from] });
        //         townsToRes.forEach(element => { townsTo[`${element.transfer_to}`] = townsId[element.transfer_to] });
        //         transfersArrRes.forEach(element => { transfersArr.push(element) });
        //         resolve({townsFrom, townsTo, transfersArr});
        //     })
        //     .catch((err) => {
        //         console.log('tawnnames-list-error', err);

        //     });
        // });
    };

    async variables(body, req, res) {
        const {townsFrom, townsTo, transfersArr} = await this.townNames(req, res);
        const microbusArr = [], specArr = [];

        const privatRes = await query(`SELECT transfer_id FROM transfers WHERE privat='true' AND price_pr!='' LIMIT 3`);
        const microbusRes = await query(`SELECT transfer_id FROM transfers WHERE microbus='true' AND price_gr!='' LIMIT 3`);
        const specRes = await query(`SELECT transfer_id FROM transfers WHERE selection='true' AND price_pr!=''`);



        const privatArr = privatRes.map(element => element );
        microbusRes.forEach(element => { microbusArr.push(element) });
        specRes.forEach(element => { specArr.push(element) });


        console.log('privatRes', privatRes);
        console.log('microbusRes', microbusRes);
        console.log('specRes', specRes);

        console.log('privatArr', privatArr);
        // console.log('microbusRes', microbusRes);
        // console.log('specRes', specRes);
        // await Promise.all([
        //     query(`SELECT transfer_id FROM transferss WHERE privat='true' AND price_pr!='' LIMIT 3`),
        //     query(`SELECT transfer_id FROM transfers WHERE microbus='true' AND price_gr!='' LIMIT 3`),
        //     query(`SELECT transfer_id FROM transfers WHERE selection='true' AND price_pr!=''`)])
        // .then(([privatRes, microbusRes, specRes]) => {
        //     privatRes.forEach(element => { privatArr.push(element) });
        //     microbusRes.forEach(element => { microbusArr.push(element) });
        //     specRes.forEach(element => { specArr.push(element) });
        // })

        return {townsFrom, townsTo, transfersArr, privatArr, microbusArr, specArr}
    }
}

module.exports = new TownsService();