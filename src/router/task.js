const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const User  = require('../models/user')
const { matches } = require('validator')
const router = new express.Router

// Creating new task 

router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try{
        const user = await User.findById(task.owner._id)
        await task.save()
        res.status(201).send({task, user})
    }catch (err) {
        res.status(400).send(err);
    }

    // task.save().then(() =>{
    //     res.status(201).send(task);
    // }).catch((err) => {
    //     res.status(400).send(err.message)
    // })
})


// Fetching all task

router.get('/task', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':');
        sort[part[0]] = part[1] === 'desc' ? -1 : 1;
    }

    try{
        // const data = await Task.find({'owner' : req.user._id})
        await req.user.populate({ //is used for sorting data by credentioal
            path : 'task',
            match,
            options: {
                limit : parseInt(req.query.limit),//the query is alwayes a string so we need to convert that in to a number
                skip : parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.task)
    }catch (err) {
        console.log(err)
        res.status(404).send(err)
    }

    // Task.find({}).then((data) => {
    //     res.send(data);
    // }).catch((err) => {
    //     res.status(404).send(err);
    // })
})



// Fetch specific task by id

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const existingTask = await Task.findOne({'_id' : req.params.id});

        if(!existingTask){
         return res.status(404).send('Not found..!');
      }
        const task = await Task.findOne({'_id' : existingTask._id, 'owner' : req.user._id})
 
        if(!task){
         return res.status(401).send({error: `Creditional not match ...!`})
        }

        res.send(task)

    } catch (error) {
        res.status(500).send(error)
    }


    // Task.findById(_id).then((data) => {
    //     if(!data){
    //         res.status(404).send(`Not found..!`)
    //     }else{
    //         res.send(data)
    //     }
    // }).catch((err) => {
    //     res.status(500).send(err)
    // })
})



// Update Task content 

router.patch('/task/:id', auth, async (req, res) => {

   const allowedUpdates = ['description','completed']
   const Updates = Object.keys(req.body)
   const isValidOperation = Updates.every((update) => allowedUpdates.includes(update));

   if(!isValidOperation){
    return res.status(404).send('Invalid updates....!');
 }
 
 try{
       const unauthenticatedTask = await Task.findOne({'_id' : req.params.id});

       if(!unauthenticatedTask){
            return res.status(404).send('Not found..!');
        }

       const task = await Task.findOne({'_id' : unauthenticatedTask._id, 'owner' : req.user._id})

       if(!task){
            return res.status(401).send(`You are not the owner of this task`)
        }
 
     //await Task.findByIdAndUpdate(req.params.id, req.body,  { new : true, runValidators : true })
        Updates.forEach((update) => task[update] = req.body[update] );
        await task.save();
 
        //  await task.save();
        res.send(task)
    
 } catch (error) {
     res.status(500).send(error)
 }
 
})



// Delete Task

router.delete('/task/:id', auth, async (req, res) => {

    try {

        const task = await Task.findOne({'_id' : req.params.id});

        if(!task){
            return res.status(404).send('Not found...!');
        }

        const deletedTask = await Task.findOneAndDelete({'_id' : req.params.id, 'owner' : req.user._id});

        if(!deletedTask){
            return res.status(401).send('trying to delete thrid peroson task ...!');
        }

        res.send(deletedTask);

    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})


// route for wrong path input

router.get('*', (req, res) => {
    res.status(404).send('Wrong Path..!')
})

router.post('*', (req, res) => {
    res.status(404).send('Wrong Path..!')
})

router.patch('*', (req, res) => {
    res.status(404).send('Wrong Path..!')
})
router.delete('*', (req, res) => {
    res.status(404).send('Wrong Path..!')
})

router.put('*', (req, res) => {
    res.status(404).send('Wrong Path..!')
})





module.exports = router