const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
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
    'isPaid': {
        'type': Boolean,
        'required': false,
        'default': false
    },
    'materials': [
        {
            'title': {
                'type': String,
                'required': false,
            },
            'description': {
                'type': String,
                'required': false,
            },
            'type': {
                'type': String,
                'enum': ['media', 'hyperlink', 'test'],
                'required': false,
            },
            'order': {
                'type': Number,
                'required': false,
            },
            'mediafile': {
                'type': mongoose.Schema.Types.ObjectId,
                'required': false,
                'default': null,
                'ref': 'Media'
            },
            'hyperlink': {
                'type': String,
                'required': false,
            },
            'test': {
                'type': mongoose.Schema.Types.ObjectId,
                'required': false,
                'default': null,
                'ref': 'Test'
            },
            'sectionProgress': {
                'type': String,
                'required': false,
                'default': 'Not Started',
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

const StudyMaterial = mongoose.model("StudyMaterial", StudyMaterialSchema);

module.exports = { StudyMaterial };