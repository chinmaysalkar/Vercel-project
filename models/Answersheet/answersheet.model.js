const mongoose = require('mongoose');

const AnswerSheetSchema = new mongoose.Schema({
    'student': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true,
        'default': null,
        'ref': 'Student'
    },
    'test': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true,
        'default': null,
        'ref': 'Test'
    },
    'questions': [ 
        {
            'questionId': {
                'type': mongoose.Schema.Types.ObjectId,
                'ref': 'Question'
            },
            'order': {
                'type': Number
            },
            'negativeMark': {
                'type': Number,
                'default': 0    
            },
            'mark': {
                'type': Number,
                'default': 0
            },
            'answers': {
                'type': mongoose.Schema.Types.Mixed
            },
            'marksObtained': {
                'type': Number,
                'default': 0
            },
            'isRight': {
                'type': mongoose.Schema.Types.Boolean
            }
    
        } 
    ],
    'totalSolved': {
        'type': Number,
        'default': 0
    },
    'totalCorrected': {
        'type': Number,
        'default': 0
    },
    'totalWrong': {
        'type': Number,
        'default': 0
    },
    'totalMarks': {
        'type': Number,
        'default': 0
    },
    'testStatus': {
        'type': String,
        'required': false,
    },
    'testTakenDate': {
        'type': String,
        'required': false,
    },
    'status': {
        'type': Boolean,
        'required': true,
        'default': true
    },
}, { 'timestamps': true });

const AnswerSheet = mongoose.model("AnswerSheet", AnswerSheetSchema);

module.exports = { AnswerSheet };