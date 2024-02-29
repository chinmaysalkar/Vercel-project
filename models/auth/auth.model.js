const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_SECRET;
const AuthSchema = new mongoose.Schema({
    'token': {
        'type': String,
        'required': true,
    },
    'user': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'ref': 'user'
    },
    'student': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Student'
    }
}, { 'timestamps': true });

// Create a new token with the user details
AuthSchema.statics.generateToken = async function( user ) {
    try {
        return await jwt.sign( user, jwtkey, {
            'algorithm': 'HS256',
            'expiresIn': '12h',
        } );
    } catch ( e ) {
        throw e;
    }
};

AuthSchema.statics.decodeToken = async function( token ) {
    try {
        return await jwt.verify( token, jwtkey );
    } catch ( e ) {
        throw e;
    }
};

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = { Auth };