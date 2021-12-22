module.exports = {
    google: {
        clientID: '899233590319-i6d0fdg4er22snqbi41ebo416m7mjgd5.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://127.0.0.1:4000/googlecallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    },
    facebook: {
        clientID: '404062408118890',
        clientSecret: '8970b299f597130e6c6a3b9112dd01e8',
        callbackURL: "https://127.0.0.1:4000/facebookcallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    }
}