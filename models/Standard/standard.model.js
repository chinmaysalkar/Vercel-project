const mongoose = require('mongoose');

const StandardSchema = new mongoose.Schema({
    'standardId': {
        'type': String,
        'required': true,
    },
    'standardName': {
        'type': String,
        'required': true,
    },
    'description': {
        'type': String,
        'required': false,
    },
    'college': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'College'
    },
    'school': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'School'
    },
    'board': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Board'
    },
    'medium': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'SchoolMedium'
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

const Standard = mongoose.model("Standard", StandardSchema);

module.exports = { Standard };