const express = require('express')
const router = new express.Router()
const Academic = require('../models/academic')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const upload = require('../utils/upload')

// JUST ADMIN CAN POST THE ACADEMIC ITEMS
router.post('/academic', admin, upload.single('content'), auth, async (req, res) => {
    try {
        const academic = new Academic({ title: req.body.title, content: req.file.buffer, owner: req.user._id })
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

router.get('/academic/:department_name', auth, async (req, res) => {
    try {
        const academic = await Academic.findOne({ title: req.params.department_name })
        if (academic == null) {
            return res.status(400).send({
                error: true,
                errorMsg: 'There is no data',
                data: null
            })
        }

        res.status(200).send({ data: academic })
    } catch (error) {
        res.status(400).send({ error: error.toString() })
    }
})


module.exports = router