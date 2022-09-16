require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const con = require('./db-models/connectDB').con;
const renderPage = require('./render-pages');
const Users = require('./user');
const cookies = require('./service').addCookies;
const token = require('./service').token;

const passport = require('passport');
const Strategy = {
    google: require('passport-google-oauth20').Strategy,
    facebook: require('passport-facebook').Strategy
};

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
                        const token_id = token(20);
                        con.query(`UPDATE users SET token = '${token_id}' WHERE userid = '${user.id}'`, (error, result) => {
                            if (error) {
                                cookies(req, res, '', '-1');
                                renderPage(req, res, 'home', `Token update error: ${error}`);
                            } else {
                                cookies(req, res, token_id, '');
                                res.redirect('/person');
                            };
                        });
                    };
                }
            )(req, res, next);
        });
    });
}