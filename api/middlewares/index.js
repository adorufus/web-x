const middlewares = {
    passport: require('passport'),
    verifyJwt: require('./verifyJwt'),
    filesUpload: require('./filesMiddleware')
}

module.exports = middlewares