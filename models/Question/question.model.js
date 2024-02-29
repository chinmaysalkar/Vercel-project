const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
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
    'standard': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Standard'
    },
    'subject': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Subject'
    },
    'chapter': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Chapter'
    },
    'topic': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Topic'
    },
    'questionType': {
        'type': String,
        'required': true,
        'enum': [ 'radio' ],
        'default': 'radio'
    },
    'question': {
        'type': String,
        'required': true,
    },
    'explanation': {
        'type': String,
        'required': false,
    },
    'questionInstruction': {
        'type': String,
        'required': false,
    },
    'questionMedia': [
        {
            'title': {
                'type': String,
                'required': false,
            },
            'file': {
                'type': mongoose.Schema.Types.ObjectId,
                'required': false,
                'default': null,
                'ref': 'Media'
            },
        }
    ],
    'explanationVideo': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Media'
    },
    'options': [
        {
            'option': {
                'type': String,
                'required': true
            },
            'isCorrect': {
                'type': Boolean,
                'required': true,
                'default': false
            }
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

const Question = mongoose.model("Question", QuestionSchema);

module.exports = { Question };