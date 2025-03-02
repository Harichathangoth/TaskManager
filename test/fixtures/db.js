const jwt = require('jsonwebtoken')
const mongoose = require('mongoose') 
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const taskOneId = new mongoose.Types.ObjectId()

const userOne = { 
    _id : userOneId,
    name : 'Hari govind123',
    age : 22,
    email : 'harichathangoth@gmail.com',
    password : '9633756579',
    tokens : [{
        token : jwt.sign({ _id : userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id : userTwoId,
    name : 'govindan',
    age : 67,
    email : 'govindannair@gmail.com',
    password : 'govindannair',
    tokens : [{
        token : jwt.sign({ _id : userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : taskOneId,
    description : 'First Task',
    completed : false,
    owner : userOneId
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Second Task',
    completed : true,
    owner : userOneId
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : 'third Task',
    completed : false,
    owner : userTwoId
}



const setUpDatabase = async () => {

    await User.deleteMany()  // this function clear database before every test and save 'userOne' in the data base
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    setUpDatabase
}

