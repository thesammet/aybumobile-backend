const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const userRole = user.role

        if (userRole != "admin") {
            throw new Error('You have not authority for that action!')
        }
        next()
    } catch (error) {
        res.status(401).send({ error: 'You have not authority for that action!' })
    }
}

module.exports = auth