const express = require('express')
const router = new express.Router()
const Academic = require('../models/academic')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.post('/academic', admin, auth, async (req, res) => {
    try {
        const academic = new Academic({
            title: req.body.title,
            announcement: req.body.announcement,
            owner: req.user._id
        })
        await academic.save()
        res.status(201).send({ data: academic })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.get('/academic/:department_name', auth, async (req, res) => {
    try {
        const academic = await Academic.findOne({ title: req.params.department_name })
        if (academic == null) {
            return res.status(400).send({
                error: true,
                errorMsg: `There is no data with ${req.params.department_name}`,
                data: null
            })
        }
        res.status(200).send({
            error: false,
            errorMsg: null,
            data: academic
        })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})


module.exports = router