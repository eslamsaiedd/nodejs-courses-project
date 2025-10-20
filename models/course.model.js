const {mongoose} = require('mongoose')

// create new schema  
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true   
    },
    price: {
        type: Number,
        required:true 
    }
})

// create model to interact with data
module.exports = mongoose.model('course', courseSchema)