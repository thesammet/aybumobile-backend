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
            //save
            await ratingObject.save()
            return res.status(201).send({ data: ratingObject })
        }
        //update
        rated.rating = req.body.rating
        let food = await Food.findById({ _id: req.body.food })
        let foodLikes = await Rating.find({ food: req.body.food, rating: 'like' })
        let foodDislike = await Rating.find({ food: req.body.food, rating: 'dislike' })

        if (req.body.rating == 'like') {
            food.likeCount = foodLikes.length
        } else if (req.body.rating == 'dislike') {
            food.dislikeCount = foodDislike.length
        } else {
            food.likeCount = foodLikes.length
            food.dislikeCount = foodDislike.length
        }

        await food.save()
        await rated.save()

        res.status(200).send({ data: rated })
    } catch (error) {
        res.status(400).send({ error })
    }
})

module.exports = router