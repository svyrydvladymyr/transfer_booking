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

    async checkValue(body) {
        return body.uk ? {
            "id": checOnTrueVal(body.id),
            "uk": checOnTrueVal(body.uk),
            "en": checOnTrueVal(body.en),
            "ru": checOnTrueVal(body.ru)
        } : body;
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
        const sql = `DELETE FROM points WHERE town_id='${body.id}'`;
        return await query(sql)
            .then(async (result) => {
                const sql = `DELETE FROM transfers
                    WHERE transfer_from='${body.id}'
                    OR transfer_to='${body.id}'`;
                return await query(sql)
                    .then(() => "Town deleted!");
            })
    }

    async list() {
        const sql = `SELECT * FROM points`;
        return await query(sql)
            .then((result) => result)
    }
}

module.exports = new TownsService();