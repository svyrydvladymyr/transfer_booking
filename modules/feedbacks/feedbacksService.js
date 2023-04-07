const telegram = require('../bot/botController');
const {query, checOnTrueVal, readyFullDate, token, clienttoken} = require('../service');

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
                '${checOnTrueVal(feedbackName)}',
                '${checOnTrueVal(feedbackSurname)}',
                '${feedbackEmail.replace(new RegExp("[^a-zA-Z0-9.&@-_]", "gi"), "")}',
                '${feedbackPhone.replace(new RegExp("[^0-9+]", "gi"), "")}',
                '${checOnTrueVal(feedbackComment)}',
                '${readyFullDate(new Date(), '')}')`;
        return await query(sql)
        .then((result) => {
            const telegramFeedback = 'Feedback ID: ' + tokenGen + '\n' +
                feedbackSurname + ' ' + feedbackName + '\n' +
                'Tel: ' + feedbackPhone + '\n' +
                'Email: ' + feedbackEmail + '\n' +
                'Date: ' + readyFullDate(new Date(), '') + '\n' +
                'Mess: ' + feedbackComment;
            telegram.botMessage(telegramFeedback, 'feedback');
            return 'Feedback sended!'
        })
    };

    async answer(req, res) {
        let sql = `UPDATE feedback
            SET status='answer',
                answer='${checOnTrueVal(req.body.answer)}',
                date_answer='${readyFullDate(new Date(), '')}'
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
            const date = ['', '3', '6', '12'].includes(req.body.param[1]['date']) ? req.body.param[1]['date'] : '3';
            if (date !== '') {
                where = ' WHERE ';
                const present_date = readyFullDate(new Date(), '');
                const date_now = new Date();
                date_now.setMonth(date_now.getMonth() - +date);
                const next_date = readyFullDate(date_now, '');
                datesql = `date_create>'${next_date}' AND date_create<'${present_date}'`;
            };
            if (status !== '' && date !== '') {
                statussql = `AND status='${status}'`;
            };
            if (status !== '' && date === '') {
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
                element.date_answer = readyFullDate(element.date_answer, '');
                element.date_create = readyFullDate(element.date_create, '');
            });
            return {'count': count_records, 'list': result};
        })
    };
}

module.exports = new FeedbacksServise();