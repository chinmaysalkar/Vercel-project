const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
    'collegeId': {
        'type': String,
        'required': true,
    },
    'collegeName': {
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
    'collegeLogo': {
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

const College = mongoose.model("College", CollegeSchema);

module.exports = { College };