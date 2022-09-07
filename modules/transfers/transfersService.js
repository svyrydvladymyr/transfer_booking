const {token, query, checOnTrueVal} = require('../service');

class transfersService {
    query_res = '';
    time_string = '';

    async createTimeArr(body) {
        const time_arr = {};
        this.time_string = '';
        for (let i = 1; i <= 10; i++) {
            time_arr[`time${i}`] = body[i] ? body[i].replace(new RegExp("[^0-9:]", "gi"), '') : '';
            this.time_string += `time${i}, `;
        }
        return time_arr;
    }

    async query(sql, mess) {
        await query(sql)
            .then((result) => {
                if (result.err) { throw new Error(result.err) };
                if (!result.err) { this.query_res = {"res": `Transfeer ${mess}!`} };
            })
        return this.query_res;
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
                    '${checOnTrueVal(body.from)}',
                    '${checOnTrueVal(body.to)}',
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
        return await this.query(sql, 'created');
    }

    async update(body) {
        const time_arr = await this.createTimeArr(body);
        const sql = `
            UPDATE transfers
            SET transfer_from='${checOnTrueVal(body.from)}',
                transfer_to='${checOnTrueVal(body.to)}',
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
            WHERE transfer_id='${checOnTrueVal(body.id)}'`;
        return await this.query(sql, 'updated');
    }

    async delete(body) {
        const sql = `DELETE FROM transfers WHERE transfer_id='${checOnTrueVal(body.id)}'`;
        return await this.query(sql, 'deleted');
    }

    async list(body) {
        const townsArr = {};
        await Promise.all([
            query(`SELECT town_id, name_uk FROM points`),
            query(`SELECT * FROM transfers`)
        ])
        .then(async([town_names, transfers]) => {
            if (town_names.err) { throw new Error(town_names.err) };
            if (transfers.err) { throw new Error(transfers.err) };
            town_names.forEach(element => {
                townsArr[`${element.town_id}`] = element.name_uk;
            });
            this.query_res = transfers.map(element => {
                return {
                    'id': element.id,
                    'transfer_id': element.transfer_id,
                    'transfer_from': townsArr[element.transfer_from],
                    'transfer_from_id': element.transfer_from,
                    'transfer_to': townsArr[element.transfer_to],
                    'transfer_to_id': element.transfer_to,
                    'price_pr': element.price_pr,
                    'price_gr': element.price_gr,
                    'time1': element.time1,
                    'time2': element.time2,
                    'time3': element.time3,
                    'time4': element.time4,
                    'time5': element.time5,
                    'time6': element.time6,
                    'time7': element.time7,
                    'time8': element.time8,
                    'time9': element.time9,
                    'time10': element.time10,
                    'selection': element.selection === 'true' ? true : false,
                    'privat': element.privat === 'true' ? true : false,
                    'microbus': element.microbus === 'true' ? true : false,
                };
            });
        })
        return {"res": this.query_res};
    }
}

module.exports = new transfersService();