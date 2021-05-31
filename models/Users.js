const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const usersSchema = new Schema({
    userId: Number,
    name: String,
    typeOfAccumulation: String,
    login: String,
    password: String,
    salt: String,
    hashPassword: String    
});

const User = mongoose.model("Users", usersSchema);

module.exports = User;