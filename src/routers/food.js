const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Food = require('../models/food')
const foodFetch = require('../utils/food_fetch')
const Rating = require('../models/rating')
const dynamicSort = require('../utils/dynamic_sort')
const _ = require('lodash')
const moment = require('moment')
const modifiedDate = require('../utils/modifyDate')
const { sendPushNotification } = require("../utils/firebase_push_notification")

router.post('/food', admin, auth, async (req, res) => {
    try {
        const foodObject = await foodFetch()
        for await (const element of foodObject) {
            const epoch = new Date(modifiedDate(element.date)).getTime();
            const mealObject = new Food({ meal: element.meal, date: element.date, epoch })
            await mealObject.save()
        }
        res.status(201).send('Meal data created succesfully')
    } catch (error) {
        res.status(400).send({ error: true, errorMessage: error.toString() })
    }
})

router.get('/food', auth, async (req, res) => {

    var dt = new Date();
    const todayENDate = (dt.getDate() + 1) + "." + (dt.getMonth() + 1) + "." + dt.getFullYear()

    let today = moment(new Date(todayENDate))
    let lastWeekDay = moment().add(6, 'days')
    try {
        const foods = await Food.find({
            epoch: {
                $gte: today,
                $lt: lastWeekDay
            }
        })
        let foodSocialResult = []
        for await (const element of foods) {
            const ratingStatus = await Rating.find({ food: element._id, owner: req.user._id })
            if (ratingStatus.length != 0) {
                foodSocialResult.push({ meal: element, likes: element.likeCount, dislikes: element.dislikeCount, ratingStatus: ratingStatus[0].rating })
            } else
                foodSocialResult.push({ meal: element, likes: element.likeCount, dislikes: element.dislikeCount, ratingStatus: 'inactive' })
        }
        res.status(200).send({ data: foodSocialResult })
    } catch (error) {
        res.status(400).send({ error: error })
    }
})

router.get('/trend', auth, async (req, res) => {
    let startMonth = moment().startOf('month')
    let endMonth = moment().endOf('month')

    try {
        const foods = await Food.find({
            epoch: {
                $gte: startMonth,
                $lt: endMonth
            }
        })
        let foodSocialResult = []
        for await (const element of foods) {
            const ratingStatus = await Rating.find({ food: element._id, owner: req.user._id })
            if (ratingStatus.length != 0) {
                foodSocialResult.push({ meal: _.omit(element.toObject(), ["commentCount", "__v", "epoch"]), comments: element.commentCount, likes: element.likeCount, dislikes: element.dislikeCount, ratingStatus: ratingStatus[0].rating })
            } else
                foodSocialResult.push({ meal: _.omit(element.toObject(), ["commentCount", "__v", "epoch"]), comments: element.commentCount, likes: element.likeCount, dislikes: element.dislikeCount, ratingStatus: 'inactive' })
        }
        const commentTrend = foodSocialResult.sort(dynamicSort("-comments")).slice(0, 7)
        const likeTrend = foodSocialResult.sort(dynamicSort("-likes")).slice(0, 7)
        const dislikeTrend = foodSocialResult.sort(dynamicSort("-dislikes")).slice(0, 7)
        res.status(200).send({ data: { commentTrend, likeTrend, dislikeTrend } })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router