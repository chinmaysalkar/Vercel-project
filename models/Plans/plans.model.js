const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    'planId': {
        'type': String,
        'required': true,
    },
    'name': {
        'type': String,
        'required': true,
    },
    'description': {
        'type': String,
        'required': false,
    },
    'isFree': {
        'type': Boolean,
        'required': true,
        'default': false
    },
    'planType': {
        'type': String,
        'required': true,
        'enum': [ 'month', 'quarter-year', 'half-year', 'year' ],
        'default': 'month'
    },
    'planAmount': {
        'type': Number,
        'required': true,
        'default': 0,
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

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = { Plan };