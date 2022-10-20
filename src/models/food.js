const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    list: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
    },
    rating: {
        type: String,
        default: null
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    }
},
    {
        timestamp: true
    })

foodSchema.methods.toJSON = function () {
    const food = this
    const foodObject = food.toObject()

    delete foodObject.__v

    return foodObject
}

const Food = mongoose.model('Food', foodSchema)

module.exports = Food