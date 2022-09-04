const {query, checOnTrueVal} = require('../service');

class TownsService {
    query_res = '';

    async result({result, body}) {
        if (result.err) {
            if (result.err.code !== 'ER_DUP_ENTRY') {
                throw new Error(result.err)
            };
            const arr = [body.id, body.uk, body.en, body.ru];
            for (let i = 0; i < arr.length; i++) {
                if (result.err.sqlMessage.includes(arr[i])) {
                    this.query_res = {"DUP": arr[i]}; break;
                };
            };
        }
        if (!result.err) {
            this.query_res = {"res": `Town ${result.changedRows === 1 ? "updated" : "created"}!`};
        };
    };

    async create(body) {
        const sql = `INSERT INTO points (town_id, name_uk, name_en, name_ru)
        VALUES ('${checOnTrueVal(body.id)}',
                '${checOnTrueVal(body.uk)}',
                '${checOnTrueVal(body.en)}',
                '${checOnTrueVal(body.ru)}')`;
        await query(sql)
            .then(async (result) => {
                await this.result({result, body})
            })
        return this.query_res;
    };

    async update(body) {
        const sql = `UPDATE points
        SET name_uk='${checOnTrueVal(body.uk)}',
            name_en='${checOnTrueVal(body.en)}',
            name_ru='${checOnTrueVal(body.ru)}'
        WHERE town_id='${checOnTrueVal(body.id)}'`;
        await query(sql)
            .then(async (result) => {
                await this.result({result, body})
            })
        return this.query_res;
    };

    async delete(body) {
        const sql = `DELETE FROM points WHERE town_id='${body.id}'`;
        await query(sql)
            .then(async (result) => {
                if (result.err) {throw new Error(result.err)};
                const sql = `DELETE FROM transfers
                    WHERE transfer_from='${body.id}'
                    OR transfer_to='${body.id}'`;
                await query(sql)
                .then((result) => {
                    if (result.err) {throw new Error(result.err)};
                    this.query_res = {"res": `Town deleted!`};
                });
            })
        return this.query_res;
    };

    async list(body) {
        const sql = `SELECT * FROM points`;
        await query(sql)
            .then((result) => {
                if (result.err) {throw new Error(result.err)};
                this.query_res = {"res": result};
            })
        return this.query_res;
    };
}

module.exports = new TownsService();