const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    meal: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        unique: true,
        autoIndex: true,
    },
    commentCount: {
        type: Number,
        required: true,
        default: 0
    },
},
    {
        timestamp: true
    })

foodSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'food'
})

foodSchema.virtual('ratings', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'food'
})

foodSchema.methods.toJSON = function () {
    const food = this
    const foodObject = food.toObject()

    delete foodObject.__v

    return foodObject
}

const Food = mongoose.model('Food', foodSchema)

module.exports = Food