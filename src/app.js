const express = require('express')
require('./db/mongoose')
const foodRouter = require('./routers/food')
const userRouter = require('./routers/user')
const academicRouter = require('./routers/academic')
const app = express()

app.use(express.json())
app.use(foodRouter)
app.use(userRouter)
app.use(academicRouter)

module.exports = app