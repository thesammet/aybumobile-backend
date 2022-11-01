const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Food = require('../models/food')
const Comment = require('../models/comment')
const Rating = require('../models/rating')
const _ = require('lodash')
const moment = require('moment')
const foodFetch = require('../utils/food_fetch')

router.post('/food', admin, auth, async (req, res) => {
    try {
        const foodObject = await foodFetch()
        for await (const element of foodObject) {
            const mealObject = new Food({ meal: element.meal, date: element.date, comments: null, rating: null, likeCount: 0, dislikeCount: 0 })
            await mealObject.save()
        }

        res.status(201).send('Meal data created succesfully')
    } catch (error) {
        res.status(400).send({ error: 'ERROR! Data are not updated!' })
    }
})

router.get('/food', auth, async (req, res) => {
    //TODO GET FOOD FROM DB
})

module.exports = router