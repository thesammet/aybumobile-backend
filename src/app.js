const express = require('express')
require('./db/mongoose')
const foodRouter = require('./routers/food')
const userRouter = require('./routers/user')
const academicRouter = require('./routers/academic')
const commentRouter = require('./routers/comment')
const ratingRouter = require('./routers/rating')
const commentRatingRouter = require('./routers/comment-rating')
const postRouter = require('./routers/aybu-social/post')
const postCommentRouter = require('./routers/aybu-social/post-comment')

const app = express()

app.use(express.json())
app.use(foodRouter)
app.use(userRouter)
app.use(academicRouter)
app.use(commentRouter)
app.use(ratingRouter)
app.use(commentRatingRouter)
app.use(postRouter)
app.use(postCommentRouter)

module.exports = app