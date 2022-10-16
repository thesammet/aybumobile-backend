const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    list: {
        type: String,
        required: true
    },
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