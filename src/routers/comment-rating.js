const express = require('express')
const router = new express.Router()
const CommentRating = require('../models/comment-rating')
const Comment = require('../models/comment')
const auth = require('../middleware/auth')

router.post('/comment-rating', auth, async (req, res) => {
    const commentLike = new CommentRating({ ...req.body, owner: req.user._id })
    try {
        const savedCommentLike = await CommentRating.findOne({ owner: req.user._id, comment: req.body.comment })
        const recentComment = await Comment.findById({ _id: req.body.comment })
        if (!savedCommentLike) {
            recentComment.likeCount = recentComment.likeCount + 1
            await recentComment.save()
            await commentLike.save()
            return res.status(201).send({ data: commentLike })
        }
        savedCommentLike.status = !savedCommentLike.status
        if (savedCommentLike.status)
            recentComment.likeCount = recentComment.likeCount + 1
        else
            if (recentComment.likeCount > 0)
                recentComment.likeCount = recentComment.likeCount - 1

        await recentComment.save()
        await savedCommentLike.save()
        res.status(200).send({ data: savedCommentLike })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})
module.exports = router