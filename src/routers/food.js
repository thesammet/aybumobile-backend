const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Food = require('../models/food')
const Comment = require('../models/comment')
const Rating = require('../models/rating')
const _ = require('lodash')
const foodFetch = require('../utils/food_fetch')
const moment = require('moment')

router.get('/food', auth, async (req, res) => {
    const queryDate = req.query.date
    let date = moment(queryDate, 'DD.MM.YYYY');
    try {
        const foodObject = await foodFetch(queryDate != null ? "date" : "daily", queryDate)
        const comments = await Comment.find({
            //get comments by 24 hours of the given date
            createdAt: {
                $gte: date.toDate(),
                $lte: moment(date).endOf('day').toDate()
            }
        })
        const likes = await Rating.find({ rating: "like", foodDate: queryDate })
        const dislikes = await Rating.find({ rating: "dislike", foodDate: queryDate })
        let userCurrent = await Rating.findOne({ owner: req.user._id, foodDate: queryDate })
        if (!userCurrent) {
            userCurrent = "notr"
        } else {
            userCurrent = userCurrent.rating
        }
        const dailyFood = new Food({ list: foodObject, comments, rating: userCurrent, likeCount: likes.length, dislikeCount: dislikes.length })
        const filteredDailyFood = _.omit(dailyFood.toObject(), ["_id"])
        res.status(200).send({ data: filteredDailyFood })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router