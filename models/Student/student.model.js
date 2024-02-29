const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  'studentId': {
    'type': String,
    'required': true,
  },
  'firstName': {
    'type': String,
    'required': true,
  },
  'lastName': {
    'type': String,
    'required': true,
  },
  'fullName': {
    'type': String,
    'required': false,
  },
  'email': {
    'type': String,
    'required': true,
  },
  'phone': {
    'type': String,
    'required': true,
  },
  'address': {
    'type': String,
    'required': false,
  },
  'city': {
    'type': String,
    'required': true,
  },
  'password': {
    'type': String,
    'required': true
  },
  'role': {
    'type': String,
    'enum': ['student'],
    'default': 'student',
    'required': true,
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
  'otp': {
    'type': String,
    'required': false,
  },
  'otpExpiry': {
    'type': String,
    'required': false,
  },
  'token': {
    'type': String,
    'required': false,
  },
  'profilePicture': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': false,
    'default': null,
    'ref': 'Media'
  },
  'isphoneVerifed': {
    'type': Boolean,
    'required': true,
    'default': false
  },
  'isemailVerifed': {
    'type': Boolean,
    'required': true,
    'default': false
  },
  'status': {
    'type': Boolean,
    'required': true,
    'default': true
  },
}, { 'timestamps': true });

const Student = mongoose.model("Student", StudentSchema);

const StudentProgressSchema = new mongoose.Schema({
  'student': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'Student'
  },
  'studyMaterial': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'StudyMaterial'
  },
  'progress': [
    {
      'section': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true,
        'ref': 'StudyMaterial.materials'
      },
      'status': {
        'type': String,
        'enum': ['Not Started', 'In Progress', 'Completed'],
        'default': 'Not Started'
      }
    }
  ]
}, { 'timestamps': true });

const StudentProgress = mongoose.model("StudentProgress", StudentProgressSchema);

module.exports = { Student, StudentProgress };