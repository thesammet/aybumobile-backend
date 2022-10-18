const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
    {
        timestamps: true
    })

commentSchema.methods.toJSON = function () {
    const comment = this
    const commentObject = comment.toObject()

    delete commentObject.__v

    return commentObject
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment