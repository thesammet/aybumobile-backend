const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complainantUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    complainedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
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