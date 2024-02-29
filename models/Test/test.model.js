const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    'testId': {
        'type': String,
        'required': true,
    },
    'title': {
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
    'testType': {
        'type': String,
        'required': true,
        'enum': [ 'mcq' ],
        'default': 'mcq'
    },
    'testStartDate': {
        'type': String,
        'required': false,
    },
    'testEndDate': {
        'type': String,
        'required': false,
    },
    'totalDuration': {
        'type': Number,
        'required': false
    },
    'totalMarks': {
        'type': Number,
        'required': true
    },
    'passingPercentage': {
        'type': Number,
        'required': false
    },
    'totalQuestions': {
        'type': Number,
        'required': true
    },
    'instrution': {
        'type': String,
        'required': false
    },
    'isNegativeMarking': {
        'type': Boolean,
        'required': true,
        'default': false
    },
    'questions': [
        {
            'question': {
                'type': mongoose.Schema.Types.ObjectId,
                'required': false,
                'default': null,
                'ref': 'Question'
            },
            'order': {
                'type': Number
            },
            'negativeMark': {
                'type': Number,
                'required': true,
                'default': 0   
            },
            'mark': {
                'type': Number,
                'required': true,
                'default': 0
            }           
        }
    ],
    'isPaid': {
        'type': Boolean,
        'required': false,
        'default': false
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

const Test = mongoose.model("Test", TestSchema);

module.exports = { Test };