const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        validate(username) {
            if (username < 4 || username > 19) {
                throw new Error({ error: 'Username greater than 4 characters!' })
            }
        },
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    firToken: {
        type: String,
        default: ""
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
},
    {
        timestamps: true
    })

userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('comment-ratings', {
    ref: 'CommentRating',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('ratings', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('academics', {
    ref: 'Academic',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('post-ratings', {
    ref: 'PostRating',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('post-comments', {
    ref: 'PostComment',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('post-comment-ratings', {
    ref: 'PostCommentRating',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.__v
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async function (deviceId) {
    const user = await User.findOne({ deviceId })
    if (!user) {
        throw new Error('Unable to login user')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User