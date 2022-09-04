require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const con = require('./connectDB').con;
const renderPage = require('./renderPage');
const Users = require('./user');

const StrategyConfig = {
    google: {
        clientID: process.env.GoogleID,
        clientSecret: process.env.GoogleSecret,
        callbackURL: process.env.GoogleCallbackURL,
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)'],
        scope: {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']},
    },
    facebook: {
        clientID: process.env.FacebookID,
        clientSecret: process.env.FacebookSecret,
        callbackURL: process.env.FacebookCallbackURL,
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)'],
        scope: {scope: ['email']},
    }
};

module.exports = (app) => {
    const passport = require('passport');
    const Strategy = {
        google: require('passport-google-oauth20').Strategy,
        facebook: require('passport-facebook').Strategy
    };
    passport.serializeUser(function(user, done) {done(null, user)});
    passport.deserializeUser(function(obj, done) {done(null, obj)});
    app.use(passport.initialize());
    ['google', 'facebook'].forEach(url => {
        passport.use(
            new Strategy[url](StrategyConfig[url],
            (accessToken, refreshToken, profile, done) => {process.nextTick( async () => {
                con.query(`SELECT * FROM users WHERE userid = '${profile.id}'`, (error, result) => {
                    if (error) {
                        done(`Problem with created user: ${error}`, null);
                    } else if (result && result.length === 0) {
                        Users.addUser(profile, done);
                    } else if (result[0].userid === profile.id){
                        Users.isUser(profile);
                        return done(null, profile);
                    };
                });
            })})
        );
        app.get(`/${url}`, passport.authenticate(`${url}`, StrategyConfig[url].scope ));
        app.get(`/${url}callback`, (req, res, next) => {
            passport.authenticate(`${url}`,
                (err, user, info) => {
                    if (err) renderPage(req, res, 'home', err);
                    if (!err) {
                        const tokenId = require('./service').token(20);
                        con.query(`UPDATE users SET token = '${tokenId}' WHERE userid = '${user.id}'`, (error, result) => {
                            if (error) {
                                require('./service').addCookies(req, res, '', '-1');
                                renderPage(req, res, 'main', `Token update error: ${error}`);
                            } else {
                                require('./service').addCookies(req, res, tokenId, '');
                                res.redirect('/person');
                            };
                        });
                    };
                }
            )(req, res, next);
        });
    });
}