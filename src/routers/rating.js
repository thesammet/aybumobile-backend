const express = require('express')
const router = new express.Router()
const Rating = require('../models/rating')
const Food = require('../models/food')
const auth = require('../middleware/auth')

router.post('/rating', auth, async (req, res) => {
    const ratingObject = new Rating({ ...req.body, owner: req.user._id, })
    try {
        let rated = await Rating.findOne({ food: req.body.food, owner: req.user._id })
        let currentFood = await Food.findOne({ _id: req.body.food })
        if (!rated) {

            req.body.rating == "like" ?
                currentFood.likeCount = currentFood.likeCount + 1
                : currentFood.dislikeCount = currentFood.dislikeCount + 1

            await currentFood.save()
            await ratingObject.save()
            return res.status(201).send({ data: ratingObject })
        }
        if (req.body.rating == "inactive") {
            rated.rating == "like" ?
                currentFood.likeCount = currentFood.likeCount - 1
                : currentFood.dislikeCount = currentFood.dislikeCount - 1
        }
        if (req.body.rating == "like") {
            if (rated.rating == "dislike") {
                currentFood.dislikeCount = currentFood.dislikeCount - 1
                currentFood.likeCount = currentFood.likeCount + 1
            } else {
                currentFood.likeCount = currentFood.likeCount + 1
            }

        }
        if (req.body.rating == "dislike") {
            if (rated.rating == "like") {
                currentFood.dislikeCount = currentFood.dislikeCount + 1
                currentFood.likeCount = currentFood.likeCount - 1
            } else {
                currentFood.dislikeCount = currentFood.dislikeCount + 1
            }
        }

        rated.rating = req.body.rating
        await currentFood.save()
        await rated.save()

        res.status(200).send({ data: rated })
    } catch (error) {
        res.status(400).send({ error })
    }
})

module.exports = router