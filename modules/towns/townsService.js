const {query, validValue} = require('../service');

class TownsService {
    async duplicateTowns(error, body) {
        const array_towns = Object.values(body);
        for (let i = 0; i < array_towns.length; i++) {
            if (error.sqlMessage.includes(array_towns[i])) {
                return {"DUP": array_towns[i]};
            };
        };
    }

    async checkValue(body) {
        return  {
            "id": await validValue(body.id),
            "uk": await validValue(body.uk),
            "en": await validValue(body.en),
            "ru": await validValue(body.ru)
        };
    }

    async create(body) {
        body = await this.checkValue(body);
        const sql = `INSERT INTO points (town_id, name_uk, name_en, name_ru)
            VALUES ('${body.id}',
                    '${body.uk}',
                    '${body.en}',
                    '${body.ru}')`;
        return await query(sql)
            .then(() => "Town created!")
    }

    async edit(body) {
        body = await this.checkValue(body);
        const sql = `UPDATE points
            SET name_uk='${body.uk}',
                name_en='${body.en}',
                name_ru='${body.ru}'
            WHERE town_id='${body.id}'`;
        return await query(sql)
            .then(() => "Town updated!")
    }

    async delete(body, req) {
        const id = req.params["townid"];
        const sql = `DELETE a.*, b.*
            FROM points a
            LEFT JOIN transfers b
            ON a.town_id = b.transfer_from OR a.town_id = b.transfer_to
            WHERE a.town_id='${id}'`;
        return await query(sql)
            .then(() => "Town deleted!");
    }

    async open(body, req) {
        const id = req.params["townid"];
        const sql = `SELECT * FROM points WHERE town_id='${id}'`;
        return await query(sql)
            .then((result) => result);
    }

    async list() {
        const sql = `SELECT * FROM points`;
        return await query(sql)
            .then((result) => result);
    }

    async townNames(body, req, res) {
        const lang = ['uk-UA', 'en-US', 'ru-RU'].includes(req.cookies ? req.cookies['lang'] : undefined)
            ? req.cookies['lang'].slice(0, 2)
            : 'uk';
        const transfers_arr = await query(`SELECT * FROM transfers`);
        const town_id_res = await query(`SELECT town_id, name_${lang} FROM points`);
        const towns_from_res = await query(`SELECT transfer_from FROM transfers GROUP BY transfer_from`);
        const towns_to_res = await query(`SELECT transfer_to FROM transfers GROUP BY transfer_to`);
        const towns_from = {},
            towns_to = {},
            town_id = [];
        town_id_res.forEach((element) => {
            town_id[`${element.town_id}`] = element[`name_${lang}`];
        });
        towns_from_res.forEach((element) => {
            towns_from[`${element.transfer_from}`] = town_id[element.transfer_from];
        });
        towns_to_res.forEach((element) => {
            towns_to[`${element.transfer_to}`] = town_id[element.transfer_to];
        });
        return { towns_from, towns_to, transfers_arr };
    }

    async variables(body, req, res) {
        const { towns_from, towns_to, transfers_arr } = await this.townNames(req, res);
        const privat = await query(`SELECT transfer_id FROM transfers WHERE privat='true' AND price_pr!='' LIMIT 3`);
        const microbus = await query(`SELECT transfer_id FROM transfers WHERE microbus='true' AND price_gr!='' LIMIT 3`);
        const spec = await query(`SELECT transfer_id FROM transfers WHERE selection='true' AND price_pr!=''`);
        return { towns_from, towns_to, transfers_arr, privat, microbus, spec };
    }
}

module.exports = new TownsService();