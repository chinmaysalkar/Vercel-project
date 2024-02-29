const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    'schoolId': {
        'type': String,
        'required': true,
    },
    'schoolName': {
        'type': String,
        'required': true,
    },
    'address': {
        'type': String,
        'required': false,
    },
    'city': {
        'type': String,
        'required': false,
    },
    'phone': {
        'type': String,
        'required': false,
    },
    'email': {
        'type': String,
        'required': false,
    },
    'schoolLogo': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Media'
    },
    'createdBy': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'User'
    },
    'updatedBy': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'User'
    },
    'status': {
        'type': Boolean,
        'required': true,
        'default': true
    },
}, { 'timestamps': true });

const School = mongoose.model("School", SchoolSchema);

module.exports = { School };