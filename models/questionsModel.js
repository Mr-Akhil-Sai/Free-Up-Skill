const mongoose = require("mongoose");

const questionSchema = mongoose.Schema( 
 {
    question:{
        type: String,
        required: true,
        trim: true
    }, 
    a:{
        _id: 1,
        type: String,
        required: true,
        trim: true
    },
    b:{
        _id: 2,
        type: String,
        required: true,
        trim: true
    },c:{
        _id: 3,
        type: String,
        required: true,
        trim: true
    },d:{
        _id: 4,
        type: String,
        required: true,
        trim: true
    }
});
const question = mongoose.model("question", questionSchema)

module.exports = question;