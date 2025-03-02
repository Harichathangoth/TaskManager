const mongoose = require('mongoose');

// mongoose.connect( process.env.MONGODB_URL ).then(() => {
//     console.log("succsess fully connected to the mongoDB database!!");
// }).catch((error) => {
//     console.log(error);
// });

const databaseConnection = async () => {
    try {
        await mongoose.connect( process.env.MONGODB_URL )
        console.log("succsess fully connected to the mongoDB database!!");
    } catch (error) {
        console.log(error)
    }
}

databaseConnection();

// const User = mongoose.model('User', {
//     name: {
//         type : String,
//         required : true,
//         trim : true
//     },
//     age: {
//         type : Number,
//         default: 0,
//         validate(value){
//             if(value < 18){
//                 throw new Error(`User is minor`);
//             }
//         }
//     },
//     email : {
//         type : String,
//         trim : true,
//         required : [true, `Please provid email..!`],
//         lowercase : true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error(`The email is invalid..!`);
//             }
//         }
//     } ,
//     password : {
//         type : String,
//         trim : true,
//         minlength : [6, 'Must be at least 6, got {VALUE}'],
//         validate(value){
//             if(value.lowercase().includes("password")){
//                 throw new Error(`the password contain "password" `);
//             }
//         }
//     }
// })

// const Task = mongoose.model('Task',{
//     discription : {
//         type : String,
//         trim : true,
//         required : true
//     },
//     completed : {
//         type : String,
//         default : 0
//     }
// })

// const me = new User({
//     name : 'Arjun',
//     age : 98,
//     email : `Harichathangoth@gmai.com`,
//     password : '   HAR  '
// });

// const programing = new Task({
//     discription : "  DSA  ",
//     completed : 9450353
// })

// me.save().then((result) => {
// console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

// programing.save().then(() => {
//     console.log(programing);
// }).then((error) => {
//     console.log(error);
// })