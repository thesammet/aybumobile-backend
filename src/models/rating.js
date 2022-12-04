const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    rating: {
        type: String,
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: 'inactive',
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

ratingSchema.methods.toJSON = function () {
    const rating = this
    const ratingObject = rating.toObject()

    delete ratingObject.__v

    return ratingObject
}

const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating