const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    'student': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true,
        'default': null,
        'ref': 'Student'
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
        'ref': 'Medium'
    },
    'standard': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Standard'
    },
    'title': {
        'type': String,
        'required': true,
    },
    'description': {
        'type': String,
        'required': false,
    },
    'content': {
        'type': String,
        'required': false,
    },
    'readBy': [ 
        {
            'student': {
                'type': mongoose.Schema.Types.ObjectId,
                'required': true,
                'default': null,
                'ref': 'Student'
            },
            'readAt': {
                'type': String,
                'required': false,
            },
        } 
    ],
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

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };