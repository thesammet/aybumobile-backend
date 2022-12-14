const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        required: true,
        default: 0
    },
    commentCount: {
        type: Number,
        required: true,
        default: 0
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

postSchema.virtual('post-ratings', {
    ref: 'PostRating',
    localField: '_id',
    foreignField: 'post'
})

postSchema.virtual('post-comments', {
    ref: 'PostComment',
    localField: '_id',
    foreignField: 'post'
})

postSchema.methods.toJSON = function () {
    const post = this
    const postObject = post.toObject()

    delete postObject.__v

    return postObject
}

const Post = mongoose.model('Post', postSchema)

module.exports = Post