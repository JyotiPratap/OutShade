const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    title: {
        required: true,
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: { 
        type: String,
         required: true 
        },
    resetPasswordToken:{
            type:String
    },
    date: {
        type: Date,
        default: Date.now
        },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema)