require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const user = require('./user').users;
const {token, query, addCookies, log, logOut} = require('./service');

class Oaugh{
    passport = require('passport');
    passsport_name = {
        google: 'google-oauth20',
        facebook: 'facebook'
    }
    config = {
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

    initialize(app){
        const session = require('express-session');
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        }));
        this.passport.serializeUser(function(user, done) {
            done(null, user)
        });
        this.passport.deserializeUser(function(obj, done) {
            done(null, obj)
        });
        app.use(this.passport.initialize());
        app.use(this.passport.session());
        app.post('/exit', logOut);
    };

    create(strategy_type) {
        const Strategy = require(`passport-${this.passsport_name[strategy_type]}`).Strategy;
        // const Strategy = {
        //     google: require('passport-google-oauth20').Strategy,
        //     facebook: require('passport-facebook').Strategy
        // };
        this.passport.use( new Strategy(this.config[strategy_type],
            async (accessToken, refreshToken, profile, done) => {
                process.nextTick( async () => {
                    const sql = `SELECT * FROM users WHERE userid = '${profile.id}'`;
                    await query(sql)
                        .then(async (result) => {
                            if (result && result.length === 0) {
                                await user.addUser(profile, done);
                            } else if (result[0].userid === profile.id){
                                await user.isUser(profile);
                                return done(null, profile);
                            };
                        })
                        .catch((error) => {
                            done(`Problem with created user: ${error}`, null);
                        })
                    }
                )
            })
        );
    }

    autorisation(app, strategy_type) {
        // const Strategy = {
        //     google: require('passport-google-oauth20').Strategy,
        //     facebook: require('passport-facebook').Strategy
        // };
        // this.passport.use(
        //     new Strategy[strategy_type](this.config[strategy_type],
        //         async (accessToken, refreshToken, profile, done) => {
        //             process.nextTick( async () => {
        //                 const sql = `SELECT * FROM users WHERE userid = '${profile.id}'`;
        //                 await query(sql)
        //                     .then(async (result) => {
        //                         if (result && result.length === 0) {
        //                             await user.addUser(profile, done);
        //                         } else if (result[0].userid === profile.id){
        //                             await user.isUser(profile);
        //                             return done(null, profile);
        //                         };
        //                     })
        //                     .catch((error) => {
        //                         done(`Problem with created user: ${error}`, null);
        //                     })
        //                 }
        //             )
        //         }
        //     )
        // );
        this.create(strategy_type);
        app.get(`/${strategy_type}`,
            this.passport.authenticate(`${strategy_type}`, this.config[strategy_type].scope )
        );
        app.get(`/${strategy_type}callback`,
            (req, res, next) => {
                this.passport.authenticate(`${strategy_type}`, { failureRedirect: '/person', failureMessage: true },
                    async (error, user, info) => {

                        // console.log(error);
                        // console.log(user);
                        // console.log(info);

                        if (error === null) {
                            const token_id = token(20);
                            const sql = `UPDATE users SET token = '${token_id}' WHERE userid = '${user.id}'`;
                            await query(sql)
                                .then(() => {
                                    addCookies(req, res, token_id, '');
                                    res.redirect('/person');
                                })
                                .catch(error => {
                                    log('ERROR update user', error);
                                    addCookies(req, res, '', '-1');
                                    res.redirect('/home');
                                })
                        } else {
                            log('ERROR get user', error);
                            res.redirect('/home');
                        };
                    }
                )(req, res, next);
            }
        );
    };
};


module.exports = new Oaugh();
