const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    gpa: Number,
    status: String,
})
module.exports = mongoose.model('Student', studentSchema)