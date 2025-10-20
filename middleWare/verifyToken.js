const jwt = require('jsonwebtoken')
const httpStatus = require('../utilities/http.status.txt')
const appError = require('../utilities/appError')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    if (!authHeader) {
        const error = appError.create("token is required", 401, httpStatus.ERROR);
        return next(error);

    }
    const token = authHeader.split(' ')[1]

    try {
        const currentUser = jwt.verify(token, process.env.jwt_secret_key)
        req.currentUser = currentUser
        console.log("currentUser",currentUser);
        
        next()

    }catch(err) {
        const error = appError.create("invalid token", 401, httpStatus.ERROR);
        return next(error);
    }
}

module.exports = verifyToken;