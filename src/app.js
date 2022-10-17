const express = require('express')
require('./db/mongoose')
const foodRouter = require('./routers/food')
const userRouter = require('./routers/user')
const app = express()

app.use(express.json())
app.use(foodRouter)
app.use(userRouter)

module.exports = app