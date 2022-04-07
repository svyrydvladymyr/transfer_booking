require('dotenv').config();
module.exports = {
    google: {
        clientID: process.env.G_clientID_local,
        clientSecret: process.env.G_clientSecret_local,
        callbackURL: "http://127.0.0.1:8054/googlecallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    },
    facebook: {
        clientID: process.env.F_clientID_local,
        clientSecret: process.env.F_clientSecret_local,
        callbackURL: "https://127.0.0.1:4000/facebookcallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    }
}

// module.exports = {
//     google: {
//         clientID: process.env.G_clientID,
//         clientSecret: process.env.G_clientSecret,
//         callbackURL: "https://transferbooking.com.ua/googlecallback",
//         profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
//     },
//     facebook: {
//         clientID: process.env.F_clientID,
//         clientSecret: process.env.F_clientSecret,
//         callbackURL: "https://transferbooking.com.ua/facebookcallback",
//         profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'email', 'picture.type(large)']
//     }
// }