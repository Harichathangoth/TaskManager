// const express = require('express');
// const multer = require('multer')
// const bcryptjs = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const User = require('./models/user');
// const Task = require('./models/task')
// const userRouter = require('./router/user')
// const taskRouter = require('./router/task')
// require('./DB/mongoose')
const app = require('./app')

// **const app = express()

const port = process.env.PORT


// app.use((req, res, next) => {
//     if(req.method == 'GET'){
//         res.send(`GET request not working...`)
//     }
//     else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send(`<h1 style = "color : red;" >Server is under Maintance, please try again later...!!</h1>`)
// })


// **app.use(express.json())

// **app.use(userRouter,taskRouter)


// the server is working up on the port 4000

app.listen(port, () =>{
    console.log(`Server is up on port ${port}`)
})

// *password hashing

// const hashing = async() => {
//     const password = 'Hari@0099'
//     hashedPassword = await bcryptjs.hash(password, 8)

//     isMatch = await bcryptjs.compare('Hari@0099', hashedPassword);
//     console.log(hashedPassword);
//     console.log(isMatch)
// }

// hashing();

// *Json Web Tokens (jwt)

// const jsonwebtoken = () => {
//     const token = jwt.sign({ "_id":"Hari123"}, 'hari@0099')
//     console.log(token)
//     const plaintxt = jwt.verify(token, 'hari@0099')
//     console.log(plaintxt);
// }

// jsonwebtoken()


//toJson work on evry time when we convert object to a Json format 
// res.send() convert the object to a Json format every time when sending the data
// toJson method work when calling res.send() and JSON.stringy()


// *Makking a connection between User and Task model, so we can fetch detail about user or task by a id

// const main = async () => {

//     const task = await Task.findById('66d2ebbe48339c9e330b5cd8')
//        await task.populate('owner')   // .execPopulate() -> Not working


//     console.log(task.owner)
// }

// const main = async () => {
    
//     const user = await User.findById('66d2e894d60381129d8d9fb3')
//     await user.populate('task')
//     console.log(user.task)
// }

// main()


// *uploading image using multer module

// const upload = multer({
//     dest : 'image'
// })

// app.post('/upload/profile', upload.single('upload'), (req, res) =>{
//     res.send()
// }

// )


