const express = require('express')
const router = new express.Router()
const Comment = require('../models/comment')
const auth = require('../middleware/auth')

router.post('/comments', auth, async (req, res) => {
    const comment = new Comment({ ...req.body, owner: req.user._id, food: req.body.foodId })
    try {
        await comment.save()
        res.status(201).send({ data: comment })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.get('/comments', auth, async (req, res) => {
    try {
        const comments = await Comment.find({})
        res.status(200).send({ data: comments })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router