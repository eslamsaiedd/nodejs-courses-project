const asyncWrapper = require('../middleWare/asyncWrapper') 
const User = require('../models/user.model')
const httpStatus = require('../utilities/http.status.txt')
const appError = require('../utilities/appError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generateJWT = require('../utilities/generateJWT')

const getAllUsers = asyncWrapper( async (req, res) => {

    const query = req.query

  //! pagination
  const limit = query.limit || 10;
  const page = query.page || 1
  const skip = (page - 1) * limit

  //* get all courses from db using course model 
  let users = await User.find({}, {'__v':false, 'password': false}).limit(limit).skip(skip)

  res.json({status: httpStatus.SUCCESS, data: {users}});
})
 
//! register
const register = asyncWrapper(async (req, res, next) => {

    const {firstName, lastName, email, password, role} = req.body

    const oldUser = await User.findOne({email: email})

    //! if this user already exists
    if (oldUser) {
        const error = appError.create("user already exists", 400, httpStatus.FAIL);
        return next(error);
    }
    
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 8)


    const newUser = new User({
        firstName,
        lastName, 
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    })

    // generate jwt token
    const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role})
    newUser.token = token    

    await newUser.save()

    res.status(201).json({status: httpStatus.SUCCESS, data:{user: newUser}})
}) 

//! login
const login = asyncWrapper( async (req, res, next) => {

    const {email, password} = req.body

    if (!email || !password) {
        const error = appError.create("email and password are required", 400, httpStatus.FAIL);
        return next(error);
    }

    const user = await User.findOne({email: email})
    //! if email not right 
    if (!user) {
        const error = appError.create("user not found", 400, httpStatus.FAIL);
        return next(error);
    }

    const matchedPassword =  bcrypt.compare(password, user.password)

    if (user && matchedPassword) {
        //* logged in successfully
        
        const token = await generateJWT({email: user.email, id: user._id, role: user.role})
       return res.json({status: httpStatus.SUCCESS, data: {token}});
    }else {
        const error = appError.create("something went wrong", 500, httpStatus.ERROR);
        return next(error);
    }
   
})


module.exports = {
    getAllUsers,
    register,
    login
}