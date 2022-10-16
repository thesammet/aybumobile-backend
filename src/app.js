const express = require('express')
require('./db/mongoose')
const foodRouter = require('./routers/food')

const app = express()

app.use(express.json())
app.use(foodRouter)

module.exports = app