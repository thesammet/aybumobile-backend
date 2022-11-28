const express = require('express')
const router = new express.Router()
const Comment = require('../models/comment')
const CommentRating = require('../models/comment-rating')
const Food = require('../models/food')
const auth = require('../middleware/auth')
const User = require('../models/user')

router.post('/comment', auth, async (req, res) => {
    const comment = new Comment({ ...req.body, owner: req.user._id })
    try {
        const food = await Food.findById({ _id: req.body.food })
        if (!food)
            return res.status(400).send({ error: true, erorrMsg: `There is no food with ${req.body.food} id` })
        food.commentCount = food.commentCount + 1
        await food.save()
        await comment.save()
        res.status(201).send({ data: comment })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.get('/comment/:food_id', auth, async (req, res) => {
    try {
        const foodComments = await Comment.find({ food: req.params.food_id }).sort('-createdAt')
        let commentResult = []
        for await (const element of foodComments) {
            const isLike = await CommentRating.findOne({ comment: element._id, status: true, owner: req.user._id })
            const commentOwner = await User.findOne({ _id: element.owner })
            if (isLike)
                commentResult.push({ comment: element, isLike: true, userRole: commentOwner.role, username: commentOwner.username })
            else
                commentResult.push({ comment: element, isLike: false, userRole: commentOwner.role, username: commentOwner.username })
        }
        res.status(200).send({ data: commentResult })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})


module.exports = router