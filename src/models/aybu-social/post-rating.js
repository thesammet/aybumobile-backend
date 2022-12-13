const mongoose = require('mongoose')

const postRatingSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        required: true,
        default: true
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
        timestamps: true
    })

postRatingSchema.methods.toJSON = function () {
    const postRating = this
    const postRatingObject = postRating.toObject()

    delete postRatingObject.__v

    return postRatingObject
}

const PostRating = mongoose.model('PostRating', postRatingSchema)

module.exports = PostRating