const telegram = require('../bot/botController');
const {query, validValue, token, date } = require('../service');

class FeedbacksServise {
    async open(body, req) {
        const id = req.params["feedbacksid"];
        const sql = `SELECT * FROM feedback WHERE idfeedback='${id}'`;
        return await query(sql)
            .then((result) => {
                result[0].settings = (req.user[0].permission === 1) ? 'true' : 'false';
                return result;
            });
    }

    async feedback(body, req) {
        const tokenGen = token(10);
        const {
            feedbackName,
            feedbackSurname,
            feedbackEmail,
            feedbackPhone,
            feedbackComment
        } = body;
        const userid = req.user ? req.user[0].userid : '';
        const sql = `INSERT INTO feedback (
            idfeedback, user_id, feedbackName, feedbackSurname,
            feedbackEmail, feedbackPhone, feedbackComment, date_create)
        VALUES ('${tokenGen}',
                '${userid}',
                '${await validValue(feedbackName)}',
                '${await validValue(feedbackSurname)}',
                '${await validValue(feedbackEmail, 'email')}',
                '${await validValue(feedbackPhone, 'phone')}',
                '${await validValue(feedbackComment)}',
                '${date.show('yyyy-mm-dd hh:mi')}')`;
        return await query(sql)
        .then((result) => {
            const telegramFeedback = 'Feedback ID: ' + tokenGen + '\n' +
                feedbackSurname + ' ' + feedbackName + '\n' +
                'Tel: ' + feedbackPhone + '\n' +
                'Email: ' + feedbackEmail + '\n' +
                'Date: ' + date.show('yyyy-mm-dd hh:mi') + '\n' +
                'Mess: ' + feedbackComment;
            telegram.botMessage(telegramFeedback, 'feedback');
            return 'Feedback sended!'
        })
    };

    async answer(body) {
        let sql = `UPDATE feedback
            SET status='answer',
                answer='${await validValue(body.answer)}',
                date_answer='${date.show('yyyy-mm-dd hh:mi')}'
            WHERE idfeedback='${body.id}'`;
        return await query(sql).then((result) => 'Answer added!')
    };

    async list(body, req) {
        let sql = '', countsql = '';
        const user = req.user[0];
        const page = (body.page && !isNaN(body.page)) ? body.page : 1;
        const limit = (body.numb && ['100', '50', '30', '2', '5'].includes(body.numb)) ? body.numb : 30;
        const start_page = (page -1) * limit;
        if (user.permission === 1) {
            let where = '', statussql = '', datesql = '';
            const status = ['answer', 'noanswer'].includes(body.param[0]['status']) ? body.param[0]['status'] : '';
            const date_count = ['', '3', '6', '12'].includes(body.param[1]['date']) ? body.param[1]['date'] : '3';
            if (date_count !== '') {
                where = ' WHERE ';
                const present_date = date.show('yyyy-mm-dd hh:mi');
                const date_now = new Date();
                date_now.setMonth(date_now.getMonth() - +date_count);
                const next_date = date.show('yyyy-mm-dd hh:mi', date_now);
                datesql = `date_create>'${next_date}' AND date_create<'${present_date}'`;
            };
            if (status !== '' && date_count !== '') {
                statussql = `AND status='${status}'`;
            };
            if (status !== '' && date_count === '') {
                where = ' WHERE ';
                statussql = `status='${status}'`;
            };
            countsql = `SELECT COUNT(*) FROM feedback
                ${where}${datesql}${statussql}`;
            sql = `SELECT * FROM feedback
                ${where}${datesql}${statussql} ORDER BY id DESC LIMIT ${start_page}, ${limit}`;
        } else {
            countsql = `SELECT COUNT(*) FROM feedback
                WHERE user_id='${user.userid}' OR feedbackEmail='${user.email}'`;
            sql = `SELECT * FROM feedback
                WHERE user_id='${user.userid}' OR feedbackEmail='${user.email}'
                ORDER BY id DESC LIMIT ${start_page}, ${limit}`;
        };
        const count_records = await query(countsql).then((result) => result[0]['COUNT(*)']);
        return await query(sql)
        .then((result) => {
            result.forEach(element => {
                element.settings = (user.permission === 1) ? 'true' : 'false';
                element.date_answer = date.show('yyyy-mm-dd hh:mi', element.date_answer);
                element.date_create = date.show('yyyy-mm-dd hh:mi', element.date_create);
            });
            return {'count': count_records, 'list': result};
        })
    };
}

module.exports = new FeedbacksServise();