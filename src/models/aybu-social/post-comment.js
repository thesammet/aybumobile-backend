const mongoose = require('mongoose')

const postCommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        required: true,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    })

postCommentSchema.virtual('post-ratings', {
    ref: 'PostRating',
    localField: '_id',
    foreignField: 'post'
})

postCommentSchema.methods.toJSON = function () {
    const postComment = this
    const postCommentObject = postComment.toObject()

    delete postCommentObject.__v

    return postCommentObject
}

const PostComment = mongoose.model('PostComment', postCommentSchema)

module.exports = PostComment