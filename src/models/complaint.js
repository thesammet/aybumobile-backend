const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complainantUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    complainedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint