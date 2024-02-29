const mongoose = require('mongoose');
const bcrypt = require( 'bcrypt' );

const UserSchema = new mongoose.Schema({
    'name': {
        'type': String,
        'required': true,
    },
    'email': {
        'type': String,
        'unique': true,
        'required': true,
        'lowercase': true,
        'trim': true
    },
    'account': {
        'type': mongoose.Schema.Types.ObjectId,
        'default': null,
        'ref': 'account'
    },
    'password': {
        'type': String,
        'required': true
    },
    'role': {
        'type': String,
        'enum': [ 'superadmin', 'seller', 'customer' ],
        'default': 'customer',
        'required': true,
    },
    'address': {
        'type': String,
        'required': true,
    },
    'phone': {
        'type': String,
        'required': true,
    },
    'country': {
        'type': String,
        'required': true,
    },
    'state': {
        'type': String,
        'required': true,
    },
    'city': {
        'type': String,
        'required': true,
    },
    'pincode': {
        'type': String,
        'required': true,
    },
    'logo': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false,
        'default': null,
        'ref': 'Media'
    },
    'status': {
        'type': Boolean,
        'required': true,
        'default': true
    },
}, { 'timestamps': true });

// Hash the user's password before saving it to the database
UserSchema.pre('save', async function (next) {
    const body = this;
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      body.password = hashedPassword;
      return next();
    } catch (err) {
      return next(err);
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };