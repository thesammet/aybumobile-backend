const express = require('express')
const router = new express.Router()
const Rating = require('../models/rating')
const auth = require('../middleware/auth')

router.post('/rating', auth, async (req, res) => {
    const rating = new Rating({ ...req.body, owner: req.user._id, foodDate: req.body.food_date })
    try {
        const isRated = await Rating.findOne({ foodDate: req.body.food_date, owner: req.user._id })
        if (!isRated) {
            //save
            await rating.save()
            return res.status(201).send({ data: rating })
        }
        //update
        const rated = await Rating.findOne({ owner: req.user._id, foodDate: req.body.food_date })
        if (!rated) {
            return res.status(404).send()
        }
        rated.rating = req.body.rating
        await rated.save()
        res.status(200).send({ data: rated })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router