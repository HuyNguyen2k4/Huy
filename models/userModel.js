const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    usename:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['admin', 'user'], required: true},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);