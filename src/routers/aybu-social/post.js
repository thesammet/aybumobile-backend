const express = require('express')
const router = new express.Router()
const Post = require('../../models/aybu-social/post')
const PostRating = require('../../models/aybu-social/post-rating')
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')

router.post('/social-post', auth, async (req, res) => {
    const post = new Post({ ...req.body, owner: req.user._id, })
    try {
        await post.save()
        res.status(201).send({ data: post })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.get('/social-post', auth, async (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    try {
        const posts = await Post.find({}).populate('owner', 'username role')
            .sort('-createdAt')
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)

        let postResult = []
        for await (const element of posts) {
            const ratingStatus = await PostRating.findOne({ post: element._id, owner: req.user._id })
            if (ratingStatus) {
                postResult.push({ post: element, ratingStatus: ratingStatus.status })
            } else
                postResult.push({ post: element, ratingStatus: false })
        }
        res.status(200).send({
            error: false,
            errorMsg: null,
            data: postResult
        })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.post('/social-post-like/:post_id', auth, async (req, res) => {
    try {
        const currentPost = await Post.findOne({ _id: req.params.post_id })
        if (!currentPost) {
            return res.status(400).send({
                error: true,
                errorMsg: `There is no post with ${req.params.post_id} id.`,
                data: null
            })
        }

        const postRating = await PostRating.findOne({ post: req.params.post_id, owner: req.user._id })
        if (postRating) {
            postRating.status
                ? currentPost.likeCount = currentPost.likeCount - 1
                : currentPost.likeCount = currentPost.likeCount + 1

            postRating.status = !postRating.status
            await currentPost.save()
            await postRating.save()
            return res.status(200).send({
                error: false,
                errorMsg: null,
                data: currentPost
            })
        }
        const postRatingCreated = new PostRating({ post: req.params.post_id, owner: req.user._id })
        currentPost.likeCount = currentPost.likeCount + 1
        await currentPost.save()
        await postRatingCreated.save()
        res.status(201).send({
            error: false,
            errorMsg: null,
            data: currentPost
        })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.delete('/social-post/:post_id', admin, auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        await post.remove()
        res.status(200).send({ error: false, data: post })
    } catch (error) {
        res.status(404).send({ error: true, errorMsg: error.toString() })
    }
})

module.exports = router