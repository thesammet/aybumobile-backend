const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Food = require('../models/food')
const foodFetch = require('../utils/food_fetch')
const Rating = require('../models/rating')

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

module.exports = router