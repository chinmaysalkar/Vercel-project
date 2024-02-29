const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    'originalname': {
        'type': String,
        'required': false,
    },
    'encoding': {
        'type': String,
        'required': false,
    },
    'mimetype': {
        'type': String,
        'required': false,
    },
    'filename': {
        'type': String,
        'required': false,
    },
    'path': {
        'type': String,
        'required': false,
    },
    'size': {
        'type': Number,
        'required': false,
    },
    'account': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true,
        'default': null,
        'ref': 'account'
    }
}, { 'timestamps': true });

const Media = mongoose.model("Media", MediaSchema);

module.exports = { Media };