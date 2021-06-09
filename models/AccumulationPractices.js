const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const AccumulationPracticSchema = new Schema({
    name: String,
    short: String,
    long: String,
    percent: {
        save: Number, 
        accumulation: Number, 
        desired: Number, 
        basic: Number,
        main: Number,
        expensive_purchases: Number,
        self_development_and_hobbies: Number,
        squander: Number,
        presents: Number,
        convert: Number,
        financialPurposes: Number,
        mandatorySpend: Number
    }
});

const AccumulationPractic = mongoose.model("AccumulationPractic", AccumulationPracticSchema);

module.exports = AccumulationPractic;