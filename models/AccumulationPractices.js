const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const AccumulationPractic = new Schema({
    name: {
        short: String,
        long: String
    },
    parameters: []
});

const AccumulationPractic = mongoose.model("User", AccumulationPractic);

module.exports = AccumulationPractic;