const {token, query, checOnTrueVal} = require('../service');

class transfersService {
    // query_res = '';
    time_string = '';
    // time_arr = {'time1' : '', 'time2' : '', 'time3' : '', 'time4' : '', 'time5' : '', 'time6' : '', 'time7' : '', 'time8' : '', 'time9' : '', 'time10' : ''};
    // async result({result, body}) {
    //     if (result.err) {
    //         if (result.err.code !== 'ER_DUP_ENTRY') {
    //             throw new Error(result.err)
    //         };
    //         const arr = [body.id, body.uk, body.en, body.ru];
    //         for (let i = 0; i < arr.length; i++) {
    //             if (result.err.sqlMessage.includes(arr[i])) {
    //                 this.query_res = {"DUP": arr[i]}; break;
    //             };
    //         };
    //     }
    //     if (!result.err) {
    //         this.query_res = {"res": `Town ${result.changedRows === 1 ? "updated" : "created"}!`};
    //     };
    // };

    async createTimeArr(body) {
        const time_arr = {}
        // body.times.forEach((element, index) => {
        //     this.time_string += `time${index + 1},`;
        // });
        this.time_string = '';
        for (let i = 1; i <= 10; i++) {
            // if (body[i] !== undefined) {
            //     this.time_arr[`time${i}`] = body[i].replace(new RegExp("[^0-9:]", "gi"), '');
            // } else {
            //     this.time_arr[`time${i}`] = ''
            // }


            time_arr[`time${i}`] = body[i] ? body[i].replace(new RegExp("[^0-9:]", "gi"), '') : '';

            this.time_string += `time${i}, `;
        }
        return time_arr;
    }



    async create(body) {
        const time_arr = await this.createTimeArr(body);

        console.log('time_arr', time_arr);
        console.log('this.time_string', this.time_string);



        const sql = `INSERT INTO transfers (
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
        console.log('sql', sql);

        await query(sql)
            .then((result) => {
                if (result.err) { throw new Error(result.err) };
                if (!result.err) {
                    return {"res": `Transfeer created!`};
                };
            })
        // return this.query_res;
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

module.exports = new transfersService();