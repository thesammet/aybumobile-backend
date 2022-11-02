const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Comment = require('../../src/models/comment')
const Rating = require('../../src/models/rating')
const CommentRating = require('../../src/models/comment-rating')
const Food = require('../../src/models/food')
const Academic = require('../../src/models/academic')

const userOneId = new mongoose.Types.ObjectId()
const adminUser = new User({
    _id: userOneId,
    deviceId: "68753A44-4D6F-1226-9C60-0050E4C00061",
    department: "Bilgisayar Mühendisliği",
    role: 'admin',
    username: "admin1234",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
})

const userTwoId = new mongoose.Types.ObjectId()
const normalUser = new User({
    _id: userTwoId,
    deviceId: "68753A44-4D6F-1226-9C60-0050E4C00062",
    department: "Tıp",
    role: 'user',
    username: "normal1234",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
})

const foodId = new mongoose.Types.ObjectId()
const foodOne = new Food({
    "meal": {
        "_id": mealId,
        "meal": ", Ezogelin Çorba, Tavuk Şinitzel, Peynirli Erişte, Ayran,",
        "date": "31.10.2022",
        "commentCount": 0
    },
    "social": {
        "likes": 0,
        "dislikes": 0
    }
})

const ratingId = new mongoose.Types.ObjectId()
const ratingOne = Rating({
    "_id": ratingId,
    "rating": "like",
    "food": mealId,
    "owner": userOneId,
    "createdAt": "2022-11-02T14:52:08.251Z",
    "updatedAt": "2022-11-02T14:52:18.953Z"
})

const academicId = new mongoose.Types.ObjectId()
const academicOne = Academic({
    "title": "test boş",
    "url": "test boş url",
    "owner": academicId,
    "_id": "636281f11fd7abf23bafbb75"
})

const commentId = new mongoose.Types.ObjectId()
const commentOne = Comment({
    "comment": "test yorumu 2 farklı kullanıcıdan",
    "likeCount": 0,
    "food": foodId,
    "owner": User,
    "_id": commentId,
    "createdAt": "2022-11-02T14:48:50.154Z",
    "updatedAt": "2022-11-02T14:48:50.154Z"
})

const commentRatingId = new mongoose.Types.ObjectId()
const commentRatingOne = CommentRating({
    "status": true,
    "comment": commentId,
    "owner": userOneId,
    "_id": commentRatingId,
    "createdAt": "2022-11-02T14:49:08.888Z",
    "updatedAt": "2022-11-02T14:49:08.888Z"
})

const setupDatabase = async () => {
    //delete whole users&tasks before creating
    await User.deleteMany()
    await Comment.deleteMany()
    await Rating.deleteMany()
    await CommentRating.deleteMany()
    await Food.deleteMany()
    await Academic.deleteMany()
    await User(normalUser).save()
    await User(adminUser).save()
    await Comment(commentId).save()
    await Rating(ratingOne).save()
    await CommentRating(commentRatingOne).save()
    await Food(foodOne).save()
    await Academic(academicId).save()
}

module.exports = {
    setupDatabase,
    userOneId,
    userTwoId,
    normalUser,
    adminUser,
    commentOne,
    commentId,
    ratingOne,
    ratingId,
    commentRatingOne,
    commentRatingId,
    foodOne,
    foodId,
    academicOne,
    academicId
}