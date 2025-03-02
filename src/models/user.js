const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcript = require('bcryptjs');
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        minlength : [4, 'Minimum 4 characters required..'],
        required : true,
        trim : true,
        
    },
    age : {
        type : Number,
        trim : true,
        default : 0,
        validate ( value ){
            if( value < 18 ){
                throw new Error(`The user is a minor`);
            }
        }
    },
    email : {
        type : String,
        unique: [true,`Already exist..`],//please drop the collection in mongodb other wise it not work properly
        required : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`Email is not valid..!`);
            }
        }
    },
    password : {
        type : String,
        required : [true, `Please provide a "password"`],
        trim : true,
        minlength : [8,`The password minimum length must be 8 characters`]
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
})



userSchema.virtual('task',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})


//Hashing user password 

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        const password = user.password
        user.password = await bcript.hash(user.password, 8)
        
    }
    next()//other wise the the program will be hang
})


//checking email and password for login

userSchema.statics.findByCredentials = async ( email, password ) => {

    const user = await User.findOne({ email })
        if(!user){
             throw new Error('User is not registered');
        }
        const isMatch = await bcript.compare(password, user.password);
        if(!isMatch){
            throw new Error('Password is incorrect..');
        }
    return user;    
}


//genarating token

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    return token;
}

//removing password and token from the response that pass to client

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// removing all the task of a user, when the user is deleteing his own account

userSchema.pre('deleteOne', { document : true }, async function (next) {

    const user = this
    const task = await Task.deleteMany({'owner' : user._id})
    
    next()
})


const User = mongoose.model('User',userSchema)
module.exports = User