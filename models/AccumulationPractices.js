const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const AccumulationPracticSchema = new Schema({
    name: {
        short: String,
        long: String
    },
    parameters: []
});

const AccumulationPractic = mongoose.model("AccumulationPractic", AccumulationPracticSchema);

module.exports = AccumulationPractic;