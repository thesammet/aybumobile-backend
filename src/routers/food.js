const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Food = require('../models/food')
const foodFetch = require('../utils/food_fetch')
const Rating = require('../models/rating')
const dynamicSort = require('../utils/dynamic_sort')
const _ = require('lodash')

router.post('/food', admin, auth, async (req, res) => {
    try {
        const foodObject = await foodFetch()
        for await (const element of foodObject) {
            const mealObject = new Food({ meal: element.meal, date: element.date })
            await mealObject.save()
        }
        res.status(201).send('Meal data created succesfully')
    } catch (error) {
        res.status(400).send({ error: true, errorMessage: error })
    }
})

router.get('/food', auth, async (req, res) => {
    try {
        const foods = await Food.find({})
        let foodSocialResult = []
        for await (const element of foods) {
            const likeCount = (await Rating.find({ food: element._id, rating: 'like' })).length
            const dislikeCount = (await Rating.find({ food: element._id, rating: 'dislike' })).length
            foodSocialResult.push({ meal: element, social: { likes: likeCount, dislikes: dislikeCount } })
        }
        res.status(200).send({ data: foodSocialResult })
    } catch (error) {
        res.status(400).send({ error })
    }
})

router.get('/trends', auth, async (req, res) => {
    try {
        const foods = await Food.find({})
        let foodSocialResult = []
        for await (const element of foods) {
            const likeCount = (await Rating.find({ food: element._id, rating: 'like' })).length
            const dislikeCount = (await Rating.find({ food: element._id, rating: 'dislike' })).length
            foodSocialResult.push({ meal: _.omit(element.toObject(), ["commentCount", "__v"]), comments: element.commentCount, likes: likeCount, dislikes: dislikeCount })
        }
        const mostCommentFood = foodSocialResult.sort(dynamicSort("-comments")).slice(0, 10)
        const likeTrend = foodSocialResult.sort(dynamicSort("-likes")).slice(0, 10)
        const dislikeTrend = foodSocialResult.sort(dynamicSort("-dislikes")).slice(0, 10)
        res.status(200).send({ data: { commentTrend: mostCommentFood, likeTrend: likeTrend, dislikeTrend: dislikeTrend } })
    } catch (error) {
        res.status(400).send({ error })
    }
})

module.exports = router