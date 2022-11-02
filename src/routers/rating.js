const express = require('express')
const router = new express.Router()
const Rating = require('../models/rating')
const Food = require('../models/food')
const auth = require('../middleware/auth')

router.post('/rating', auth, async (req, res) => {
    const ratingObject = new Rating({ ...req.body, owner: req.user._id, })
    try {
        let rated = await Rating.findOne({ food: req.body.food, owner: req.user._id })
        if (!rated) {
            await ratingObject.save()
            return res.status(201).send({ data: ratingObject })
        }
        rated.rating = req.body.rating
        await rated.save()
        res.status(200).send({ data: rated })
    } catch (error) {
        res.status(400).send({ error })
    }
})

module.exports = router