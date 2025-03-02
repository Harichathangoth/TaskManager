const express = require('express');
require('./DB/mongoose')
const multer = require('multer')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/user');
const Task = require('./models/task')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')


const app = express()


app.use(express.json())

app.use(userRouter,taskRouter)

module.exports = app




