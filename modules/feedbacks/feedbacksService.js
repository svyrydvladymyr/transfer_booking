const telegram = require('../bot/botController');
const {query, validValue, token, clienttoken, date } = require('../service');

class FeedbacksServise {
    async feedback(req, res) {
        const tokenGen = token(10);
        const {
            feedbackName,
            feedbackSurname,
            feedbackEmail,
            feedbackPhone,
            feedbackComment
        } = req.body;
        const userid = await query(`SELECT userid FROM users WHERE token = '${clienttoken(req, res)}'`)
            .then((user_id) => !user_id.err && user_id != "" ? user_id[0].userid : "" );
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

    async answer(req, res) {
        let sql = `UPDATE feedback
            SET status='answer',
                answer='${await validValue(req.body.answer)}',
                date_answer='${date.show('yyyy-mm-dd hh:mi')}'
            WHERE idfeedback='${req.body.id}'`;
        return await query(sql).then((result) => 'Answer added!')
    };

    async list(req, res) {
        let sql = '', countsql = '';
        const user = req.user[0];
        const page = (req.body.page && !isNaN(req.body.page)) ? req.body.page : 1;
        const limit = (req.body.numb && ['100', '50', '30', '2', '5'].includes(req.body.numb)) ? req.body.numb : 30;
        const start_page = (page -1) * limit;
        if (user.permission === 1) {
            let where = '', statussql = '', datesql = '';
            const status = ['answer', 'noanswer'].includes(req.body.param[0]['status']) ? req.body.param[0]['status'] : '';
            const date_count = ['', '3', '6', '12'].includes(req.body.param[1]['date']) ? req.body.param[1]['date'] : '3';
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