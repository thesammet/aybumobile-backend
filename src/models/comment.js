const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        required: true,
        default: 0
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
},
    {
        timestamps: true
    })

commentSchema.virtual('comment-ratings', {
    ref: 'CommentRating',
    localField: '_id',
    foreignField: 'comment_id'
})

commentSchema.methods.toJSON = function () {
    const comment = this
    const commentObject = comment.toObject()

    delete commentObject.__v

    return commentObject
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment