const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    'boardId': {
        'type': String,
        'required': true,
    },
    'boardName': {
        'type': String,
        'required': true,
    },
    'description': {
        'type': String,
        'required': false,
    },
    'boardLogo': {
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

const Board = mongoose.model("Board", BoardSchema);

module.exports = { Board };