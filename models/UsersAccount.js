const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UsersAccountSchema = new Schema({
    login: String,
    salt: String,
    hashPassword: String,
    allMoney: Number,
    nameSchema: String 
});

const UsersAccount = mongoose.model("UsersAccount", UsersAccountSchema);

module.exports = UsersAccount;