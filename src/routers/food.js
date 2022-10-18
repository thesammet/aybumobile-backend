const express = require('express')
const router = new express.Router()
const Food = require('../models/food')
const Comment = require('../models/comment')
const foodFetch = require('../utils/food_fetch')

router.get('/food', async (req, res) => {
    try {
        const foodObject = await foodFetch(req.query.date != null ? "date" : "daily", req.query.date)
        const dailyFood = new Food({ list: foodObject })
        res.status(200).send({ data: dailyFood })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router