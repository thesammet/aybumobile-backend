const express = require('express')
const router = new express.Router()
const Academic = require('../models/academic')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// JUST ADMIN CAN POST THE ACADEMIC ITEMS
router.post('/academic', admin, auth, async (req, res) => {
    const academic = new Academic({ ...req.body, owner: req.user._id })
    try {
        await academic.save()
        res.status(201).send({ data: academic })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

router.get('/academic', auth, async (req, res) => {
    try {
        const academics = await Academic.find({})
        res.status(200).send({ data: academics })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})

module.exports = router