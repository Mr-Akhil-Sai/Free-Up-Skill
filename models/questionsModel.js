const mongoose = require("mongoose");

const questionSchema = mongoose.Schema( 
 {
    question:{
        type: String,
        required: true,
        trim: true
    },
    options:[
        {
            type: Object,
            required: true,
            trim: true,
        },
        {
            type: Object,
            required: true,
            trim: true,
        },
        {
            type: Object,
            required: true,
            trim: true,
        },
        {
            type: Object,
            required: true,
            trim: true,
        }

    ]
});
const question = mongoose.model("question", questionSchema)

module.exports = question;