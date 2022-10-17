const express = require('express')
const router = new express.Router()
const Food = require('../models/food')
const foodFetch = require('../utils/food_fetch')

router.get('/food', async (req, res) => {
    try {
        const foodObject = await foodFetch()
        res.status(200).send({ data: foodObject })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router