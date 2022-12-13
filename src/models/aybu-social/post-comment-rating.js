const mongoose = require('mongoose')

const postCommentRatingSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    postComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostComment'
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

postCommentRatingSchema.methods.toJSON = function () {
    const postCommentRating = this
    const postCommentRatingObject = postCommentRating.toObject()

    delete postCommentRatingObject.__v

    return postCommentRatingObject
}

const PostCommentRating = mongoose.model('PostCommentRating', postCommentRatingSchema)

module.exports = PostCommentRating