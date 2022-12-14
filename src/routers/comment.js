const express = require('express')
const router = new express.Router()
const Comment = require('../models/comment')
const CommentRating = require('../models/comment-rating')
const Food = require('../models/food')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
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
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }

    try {
        const foodComments = await Comment.find({ food: req.params.food_id }).sort('-createdAt')
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)
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

router.delete('/comment/:_id', admin, auth, async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params._id })
        if (!comment)
            return res.status(400).send({ error: true, erorrMsg: `There is no comment with ${req.params._id} id` })

        const food = await Food.findOne({ _id: req.body.food })
        if (!food)
            return res.status(400).send({ error: true, erorrMsg: `There is no food with ${req.body.food} id` })
        food.commentCount = food.commentCount - 1

        await food.save()
        await comment.remove()
        res.status(200).send({ error: false, data: comment })
    } catch (error) {
        res.status(404).send({ error })
    }
})


module.exports = router