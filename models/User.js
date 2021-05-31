const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const usersSchema = new Schema({
    name: String,
    typeOfAccumulation: String  
});

const User = mongoose.model("User", usersSchema);

module.exports = User;