const mongoose = require('mongoose')

const academicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: Buffer,
        required: true,
    },
    exam: {
        type: Buffer,
        default: null
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
    {
        timestamp: true
    })

academicSchema.methods.toJSON = function () {
    const academic = this
    const academicObject = academic.toObject()

    delete academicObject.__v

    return academicObject
}

const Academic = mongoose.model('Academic', academicSchema)

module.exports = Academic