const mongoose = require('mongoose')


const TaskSchema = new mongoose.Schema({
    description : {
        type : String,
        minlength : [4, 'please provide minimum 4 characters..'],
        required : [true, `please provide the task discription`],
        trim : true,
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps : true
})

const Task = mongoose.model('Task',TaskSchema);
module.exports = Task