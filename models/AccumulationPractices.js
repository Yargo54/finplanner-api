const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const AccumulationPracticSchema = new Schema({
    name: String,
    short: String,
    long: String,
    percent: {}
});

const AccumulationPractic = mongoose.model("AccumulationPractic", AccumulationPracticSchema);

module.exports = AccumulationPractic;