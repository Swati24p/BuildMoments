const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const momentSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "user",
        trim: true,
        unique: true
    },
    momentImage: {
        type: String,
    },//s3 link
    tags: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        trim: true,
        required: true
        //comment: "Holds at max 100 characters"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

module.exports = mongoose.model('moment', momentSchema);