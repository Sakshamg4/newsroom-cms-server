// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String, // hashed
    role: {
        type: String,
        enum: ['Admin', 'Editor', 'Writer', 'Reader'],
        default: 'Reader'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
