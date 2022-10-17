const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const _ = require('lodash')
//user login, get comments&star by id, all comments&star, post comment&star, update user

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

module.exports = router