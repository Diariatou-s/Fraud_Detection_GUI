const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    step: {
        type: Number,
        require: true
    },
    type: {
        type: Number,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    oldbalanceOrg: {
        type: Number,
        require: true
    },
    newbalanceOrig: {
        type: Number,
        require: true
    },
    oldbalanceDest: {
        type: Number,
        require: true
    },
    newbalanceDest: {
        type: Number,
        require: true
    },
    isFraud: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model("Data", DataSchema);