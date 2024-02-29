const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    'name': {
        'type': String,
        'required': true,
    },
    'owner': {
        'type': mongoose.Schema.Types.ObjectId,
        'default': null,
        'ref': 'user'
    }
}, { 'timestamps': true });

const Account = mongoose.model("Account", AccountSchema);

module.exports = { Account };