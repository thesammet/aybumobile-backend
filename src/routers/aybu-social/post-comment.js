const express = require('express')
const router = new express.Router()
const Post = require('../../models/aybu-social/post')
const PostComment = require('../../models/aybu-social/post-comment')
const PostCommentRating = require('../../models/aybu-social/post-comment-rating')
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')
const Complaint = require('../../models/complaint')

router.post('/social-post-comment', auth, async (req, res) => {
    const postComment = new PostComment({ ...req.body, post: req.body.post_id, owner: req.user._id })
    try {
        const currentPost = await Post.findById(req.body.post_id)
        currentPost.commentCount = currentPost.commentCount + 1

        await currentPost.save()
        await postComment.save()
        res.status(201).send({
            error: false,
            errorMsg: null,
            data: postComment
        })
    } catch (error) {
        res.status(400).send({
            error: true,
            errorMsg: error.toString(),
            data: null
        })
    }
})

router.get('/social-post-comment/:post_id', auth, async (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    try {
        const postComments = await PostComment.find({ post: req.params.post_id })
            .populate('owner', 'username role')
            .sort('-createdAt')
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)

        const myComplaintPosts = await Complaint.find({ complainantUser: req.user._id });

        const notComplainedPosts = [];
        for (const element of postComments) {
            const complained = myComplaintPosts.some((complaint) =>
                element.owner._id.toString() === complaint.complainedUser.toString()
            );
            if (!complained) {
                notComplainedPosts.push(element);
            }
        }

        let postCommentResult = []
        for await (const element of notComplainedPosts) {
            const ratingStatus = await PostCommentRating.findOne({ postComment: element._id, owner: req.user._id })
            if (ratingStatus) {
                postCommentResult.push({ post: element, ratingStatus: ratingStatus.status })
            } else
                postCommentResult.push({ post: element, ratingStatus: false })
        }
        res.status(200).send({
            error: false,
            errorMsg: null,
            data: postCommentResult
        })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.patch('/social-post-comment-rating/:post_comment_id', auth, async (req, res) => {
    try {
        const currentComment = await PostComment.findOne({ post: req.body.post_id, _id: req.params.post_comment_id })
        const postCommentRating = await PostCommentRating.findOne({ postComment: req.params.post_comment_id, owner: req.user._id })

        if (postCommentRating) {
            postCommentRating.status
                ? currentComment.likeCount = currentComment.likeCount - 1
                : currentComment.likeCount = currentComment.likeCount + 1

            postCommentRating.status = !postCommentRating.status
            await currentComment.save()
            await postCommentRating.save()
            return res.status(200).send({
                error: false,
                errorMsg: null,
                data: currentComment
            })
        }
        const postRatingCreated = new PostCommentRating({ postComment: req.params.post_comment_id, owner: req.user._id })
        currentComment.likeCount = currentComment.likeCount + 1
        await currentComment.save()
        await postRatingCreated.save()
        res.status(201).send({
            error: false,
            errorMsg: null,
            data: currentComment
        })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.delete('/social-post-comment/:comment_id', admin, auth, async (req, res) => {
    try {
        const currentPost = await Post.findById(req.body.post_id)
        currentPost.commentCount = currentPost.commentCount - 1

        const postComment = await PostComment.findById(req.params.comment_id)
        await currentPost.save()
        await postComment.remove()
        res.status(200).send({ error: false, data: postComment })
    } catch (error) {
        res.status(404).send({ error: true, errorMsg: error.toString() })
    }
})

module.exports = router