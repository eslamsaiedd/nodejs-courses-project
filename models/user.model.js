const { uniq } = require('lodash')
const {mongoose} = require('mongoose')
const validator = require('validator')
const userRoles = require('../utilities/user-Roles')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        uniq: true,
        validate:[validator.isEmail, 'filed must be a valid email address'] 
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: 'uploads/profile.png'
    }
})


// create model to interact with data
module.exports = mongoose.model('user', userSchema)