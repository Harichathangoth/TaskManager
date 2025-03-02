const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const mail = require('../email/account')
const router = new express.Router()


// Registering new user

router.post('/user/register', async (req, res) =>{
    //console.log(req.body)
    
    try{
        const user = new User(req.body);
        const token =await user.generateAuthToken()
        await user.save()
        mail.welcomeMail(user.email, user.name);
        res.status(201).send({user, token });
    }catch (err) {
        res.status(400).send(err);
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((err) => {
    //     res.status(401).send(`Erorr me: ${err}`)
    // })

});

// User Login  

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password); // work on schemas
        const token = await user.generateAuthToken() // working on inheritance
        await user.save()
        res.send({ user, token })  //  user : user.getPublicProfile()  -> change to toJson() it work when calling res.send()that convert object to JSON
    } catch (error) {
        res.status(404).send(`Can't login ..`)
    }
})


// User Logout

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

// Logout from all devices

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

// Fetch all user informations

router.get('/user/profile', auth, async (req, res) => {

    try{
        const users = req.user
        if(!users){
            res.status(404).send()
        }else{
            const mytoken = {
                name : 'hari'
            }
            res.send({users, mytoken});
        }
    }catch (err){
        res.status(500).send(err);
    }

    // User.find({}).then((users) => {
    //     if(!users){
    //         res.status(404).send(`Not Found..!`);
    //     }
    //     res.send(users);
    // }).catch((error) => {
    //     res.status(500);
    // });
});


// Fetch infromation about specific user by id

router.get('/user/:id', async (req, res) => {
     const _id = req.params.id
    console.log(_id);

    try{
        const user = await User.findById(_id);
        if(!user){
            res.status(404).send('Not Found...!');
        }else{
            res.send(user)
        }
    }catch (err){
        res.status(500).send(err);
    }
    // User.findById(_id).then((user) => {
    //     if(!user){
    //         res.status(404).send(`not exist..!`);
    //     }else{
    //         res.send(user);
    //     }
    // }).catch((error) => {
    //     res.status(404).send(error);
    // })
});

// Updating user information

router.patch('/user/profile', auth, async (req, res) => {

    const update = Object.keys(req.body);
    const allowedUpdates = ['name','age','email','password'];
    const isAllowedUpdates = update.every((update)=> allowedUpdates.includes(update));

    if(!isAllowedUpdates){
        return res.status(406).send('Wrong Updates..!');
    }

    try{
        // const user = await User.findById(req.user._id);
        update.forEach((update) =>  req.user[update] = req.body[update] )

        await req.user.save();

        // if(!user){
        //   return  res.status(404).send(`Not found....!`);
        // }
        res.send(req.user);

    } catch (error) {
        res.status(500).send(`Error: ${error.message}`)
    }
})

// Create or updating user profile avatar

const upload = multer({
    // dest : 'avatar',
    limits : {
        fileSize : 4000000
    },
    fileFilter (req, file, CB) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return CB(new Error('Please upload a image..'))
        }
        CB(undefined, true)
    }
})

router.post('/user/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({'error' : error.message})//Error handling, other wise  get html document insted of json response for the multer
})

// Removing user profile avatar

router.delete('/user/profile/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
})

// Fetching user avatar

router.get('/user/:id/avatar', async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('content-type', 'image/png'); // mention the content type as a image format other wise it send a json, eg:(jpg,png,jpeg)
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }

})

// Delete User

router.delete('/user/profile', auth, async (req, res) => {
    
    try {

        const user = await User.findOne({'_id': req.user._id});
        // if(!user){
        //     return res.status(404).send('Not found..');
        // }
        await user.deleteOne()//{'id' : user._id}
        mail.cancelMail(user.email, user.name);
        res.send(user)

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})



module.exports = router