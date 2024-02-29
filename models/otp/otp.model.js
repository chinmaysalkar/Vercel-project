const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    'otp': {
        'type': String,
        'required': true,
    },
    'studentId': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Student'
    },
    'createdAt': {
        'type': Date,
        'default': Date.now,
        'expires': 60 // this otp will be deleted after 1 minute
    }
});

const OTP = mongoose.model("OTP", OtpSchema);

module.exports = { OTP };