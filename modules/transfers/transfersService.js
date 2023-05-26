const {token, query, validValue} = require('../service');

class transfersService {
    time_string = '';

    async createTimeArr(body) {
        const time_arr = {};
        this.time_string = '';
        for (let i = 1; i <= 10; i++) {
            time_arr[`time${i}`] = body.times[i-1] !== undefined
                ? body.times[`${i-1}`].replace(new RegExp("[^0-9:]", "gi"), '')
                : '';
            this.time_string += `time${i}, `;
        };
        return time_arr;
    }

    async create(body) {
        const time_arr = await this.createTimeArr(body);
        const sql = `
            INSERT INTO transfers (
                transfer_id,
                transfer_from,
                transfer_to,
                price_pr,
                price_gr,
                ${this.time_string}
                selection,
                privat,
                microbus)
            VALUES ('${token(10)}',
                    '${await validValue(body.from)}',
                    '${await validValue(body.to)}',
                    '${body.pr.replace(new RegExp("[^0-9]", "gi"), '')}',
                    '${body.gr.replace(new RegExp("[^0-9]", "gi"), '')}',
                    '${time_arr.time1}',
                    '${time_arr.time2}',
                    '${time_arr.time3}',
                    '${time_arr.time4}',
                    '${time_arr.time5}',
                    '${time_arr.time6}',
                    '${time_arr.time7}',
                    '${time_arr.time8}',
                    '${time_arr.time9}',
                    '${time_arr.time10}',
                    '${body.select === true ? true : false}',
                    '${body.privat === true ? true : false}',
                    '${body.microbus === true ? true : false}')`;
        return await query(sql)
            .then(() => "Transfer added!");
    }

    async edit(body) {
        const time_arr = await this.createTimeArr(body);
        const sql = `
            UPDATE transfers
            SET transfer_from='${await validValue(body.from)}',
                transfer_to='${await validValue(body.to)}',
                price_pr='${body.pr.replace(new RegExp("[^0-9]", "gi"), '')}',
                price_gr='${body.gr.replace(new RegExp("[^0-9]", "gi"), '')}',
                time1='${time_arr.time1}',
                time2='${time_arr.time2}',
                time3='${time_arr.time3}',
                time4='${time_arr.time4}',
                time5='${time_arr.time5}',
                time6='${time_arr.time6}',
                time7='${time_arr.time7}',
                time8='${time_arr.time8}',
                time9='${time_arr.time9}',
                time10='${time_arr.time10}',
                selection='${body.select === true ? true : false}',
                privat='${body.privat === true ? true : false}',
                microbus='${body.microbus === true ? true : false}'
            WHERE transfer_id='${await validValue(body.id)}'`;
        return await query(sql)
            .then(() => "Transfer updated!");
    }

    async open(body, req) {
        const id = req.params["transferid"];
        const townsArr = {};
        const sql = `SELECT * FROM transfers WHERE transfer_id='${id}'`;
        return await query(sql)
        .then(async(transfers) => {
            const town_names = await query(`SELECT town_id, name_uk FROM points`);
            town_names.forEach(element => {
                townsArr[`${element.town_id}`] = element.name_uk;
            });
            transfers[0].transfer_from_id = transfers[0].transfer_from;
            transfers[0].transfer_to_id = transfers[0].transfer_to;
            transfers[0].transfer_from = townsArr[transfers[0].transfer_from];
            transfers[0].transfer_to = townsArr[transfers[0].transfer_to];
            return transfers;
        });
    }

    async delete(body, req) {
        const id = req.params["transferid"];
        console.log(id);
        const sql = `DELETE FROM transfers WHERE transfer_id='${id}'`;
        return await query(sql)
            .then(() => "Transfer deleted!");
    }

    async list(body) {
        const townsArr = {};
        return await query(`SELECT * FROM transfers`)
        .then(async(transfers) => {
            const town_names = await query(`SELECT town_id, name_uk FROM points`);
            town_names.forEach(element => {
                townsArr[`${element.town_id}`] = element.name_uk;
            });
            return await transfers.map(element => {
                return {
                    'id': element.id,
                    'transfer_id': element.transfer_id,
                    'transfer_from': townsArr[element.transfer_from],
                    'transfer_to': townsArr[element.transfer_to],
                    'selection': element.selection === 'true' ? true : false,
                    'privat': element.privat === 'true' ? true : false,
                    'microbus': element.microbus === 'true' ? true : false,
                };
            });
        });
    }

    async saveposition(body) {
        const set_of_query = Object.entries(body).map((value, key) => {
            return `WHEN transfer_id = '${Object.keys(body)[key]}' THEN '${Object.values(body)[key]}'`;
        });
        const sql = `UPDATE transfers SET id = CASE ${set_of_query.join(' ')} END`;
        return await query(sql)
            .then((result) => 'Position saved!');
    }
}

module.exports = new transfersService();