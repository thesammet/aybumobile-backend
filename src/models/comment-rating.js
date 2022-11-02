const mongoose = require('mongoose')

const commentRatingSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
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

commentRatingSchema.virtual('comment-ratings', {
    ref: 'CommentRating',
    localField: '_id',
    foreignField: 'comment'
})

commentRatingSchema.methods.toJSON = function () {
    const commentRating = this
    const commentRatingObject = commentRating.toObject()

    delete commentRatingObject.__v

    return commentRatingObject
}

const CommentRating = mongoose.model('CommentRating', commentRatingSchema)

module.exports = CommentRating