const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    solde: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("User", UserSchema);