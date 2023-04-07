const { token, query, addCookies, log } = require("../service");

class OauthService {
    async createUser(profile) {
        const date = new Date();
        return {
            id: profile.id,
            provider: profile.provider,
            firstName: profile.name && profile.name.givenName ? profile.name.givenName : "",
            lastName: profile.name && profile.name.familyName ? profile.name.familyName : "",
            email: profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined ? profile.emails[0].value : "",
            photo: profile.photos && profile.photos.length > 0 && profile.photos[0].value !== undefined ? profile.photos[0].value : "",
            date: `${date.toISOString().slice(0, 10)} ${date.getHours()}:${date.getMinutes()}`,
        };
    }

    async updateToken(req, res, user_id) {
        const token_id = token(20);
        const sql = `UPDATE users SET token = '${token_id}' WHERE userid = '${user_id}'`;
        await query(sql)
            .then(() => {
                addCookies(req, res, token_id, "");
                res.redirect("/person");
            })
            .catch((error) => {
                log("ERROR update token:", error);
                addCookies(req, res, "", "-1");
                res.redirect("/home");
            });
    }

    async addUser(profile, done) {
        const user = await this.createUser(profile);
        const sql = `INSERT INTO users (userid, name, surname, provider, email, date_registered, ava)
                   VALUES ('${user.id}',
                   '${user.firstName}',
                   '${user.lastName}',
                   '${user.provider}',
                   '${user.email}',
                   '${user.date}',
                   '${user.photo}')`;
        await query(sql)
            .then(() => done(null, profile))
            .catch((error) => done(`ERROR creating user: ${error}`, null));
    }

    async isUser(profile, done) {
        const user = await this.createUser(profile);
        const sql = `UPDATE users SET
                name = '${user.firstName}',
                surname = '${user.lastName}',
                email = '${user.email}',
                ava = '${user.photo}'
            WHERE userid = '${user.id}'`;
        await query(sql)
            .then(() => done(null, profile))
            .catch((error) => {
                log("ERROR updating user:", error);
                done(null, profile);
            });
    }

    logOut(req, res) {
        addCookies(req, res, "", "-1");
        res.redirect("/");
    }
}

module.exports = new OauthService();
