const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UsersAccountSchema = new Schema({
    login: String,
    password: String,
    salt: String,
    hashPassword: String    
});

const UsersAccount = mongoose.model("UsersAccount", UsersAccountSchema);

module.exports = UsersAccount;