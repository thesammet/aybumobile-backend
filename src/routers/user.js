const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Complaint = require('../models/complaint')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const _ = require('lodash')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()

        //delete the token property on spesific spots lodash
        const userModelFiltered = _.omit(user.toObject(), ["_id", "__v", "tokens"])

        res.status(201).send({ user: userModelFiltered, token })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.deviceId)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'department', 'faculty']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates: Fields can be username, department and faculty!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send({ error })
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send({ user: req.user })
    } catch (error) {
        res.status(404).send({ error: error.toString() })
    }
})

router.get('/users', auth, admin, async (req, res) => {
    const users = await User.find()
    try {
        res.status(200).send(users)
    } catch (error) {
        res.status(404).send({ error: error.toString })
    }
})

router.get('/role/me', auth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).send({ error: false, role: user.role })
    } catch (error) {
        res.status(404).send({ error: true, errorMsg: error })
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        const user = req.user
        await user.remove()
        res.status(200).send({ user })
    } catch (error) {
        res.status(404).send({ error })
    }
})

router.post('/users/create-complaint', auth, async (req, res) => {
    const complaint = new Complaint({ ...req.body, complainantUser: req.user._id })
    try {
        await complaint.save()
        res.status(201).send({ complaint })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router