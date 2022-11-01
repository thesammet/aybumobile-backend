const express = require('express')
const router = new express.Router()
const Comment = require('../models/comment')
const auth = require('../middleware/auth')

router.post('/comment', auth, async (req, res) => {
    const comment = new Comment({ ...req.body, owner: req.user._id })
    try {
        await comment.save()
        res.status(201).send({ data: comment })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.get('/comment/:food_id', auth, async (req, res) => {
    try {
        const foodComments = await Comment.find({ food: req.params.food_id })
        res.status(200).send({ data: foodComments })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.post('/like-comment/:food_id', auth, async (req, res) => {
    try {
        const comment = await Comment.findOne({ owner: req.user._id, food: req.params.food_id })
        if (!comment) {
            return res.status(404).send({ error: true, errorMsg: 'There is no such comment!' })
        }
        //TODO: Change status and like count
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})
module.exports = router