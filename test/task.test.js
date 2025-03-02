const request = require('supertest')
const app = require('./../src/app')
const Task = require('./../src/models/task')
const { userOneId, userOne, userTwo, taskOne, setUpDatabase } = require('./fixtures/db')


beforeEach( setUpDatabase )


// Task creation section /////////////////////////////////////////////////////

test('should create new task', async () => { 

    const response = await request(app).post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'testing the task creation'
        })
        .expect(201)

        // Checking the database is that creation is successfull, by using response
        
        const task = await Task.findById(response.body.task._id)
        expect(task).not.toBeNull()
        expect(task.completed).toEqual(false)

})


test('Should not create task with invalid description', async () => {
    const response = await request(app).post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : " ",
        })
        .expect(400)
})


test('Should not create task with invalid completed', async () => {
    const response = await request(app).post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed : "complete",
        })
        .expect(400)
})

/////////////////////////////////////////////////////////////////////////////////////


// Task fetching section  //////////////////////////////////////////////////////////

test('should fetch all task of a user', async () => {
    const response = await request(app).get('/task')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .expect(200)

        // Asserting that the getting correct count of tasks
        
        expect(response.body.length).toBe(2)
})


test('Should fetch user task by id', async () => { 
    const response = await request(app).get(`/task/${taskOne._id}`)
                    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)  
                    .send()
                    .expect(200)

        // Asserting the response was correct         
      
        expect(response.body).toMatchObject({
            description : "First Task"
        })  
        
})



test('Should not fetch user task by id if unauthenticated', async () => { 
    const response = await request(app).get(`/task/${taskOne._id}`)
                    .send()
                    .expect(401)

        // Asserting there is no content in the response          
      
            expect(response.body).toMatchObject({"error": "please authenticate...!"}) 
        
})


test('Should not fetch other users task by id', async () => { 
    const response = await request(app).get(`/task/${taskOne._id}`)
                    .set('Authorization', `Bearer ${ userTwo.tokens[0].token }`)  
                    .send()
                    .expect(401)
        // Asserting there is no content in the response          
           
        expect(response.body).toMatchObject({error: `Creditional not match ...!`}) 
        
})

///////////////////////////////////////////////////////////////////////////////////////////////



// Sorting task by completaion  ////////////////////////////////////////////////////////

test('Should fetch only completed tasks', async () => { 
    const response = await  request(app).get('/task?completed=true')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send()
        .expect(200)

        //Asserting response contain only the completed task

        expect(response.body.length).toBe(1)
 })


 
test('Should fetch only incomplete tasks', async () => { 
    const response = await  request(app).get('/task?completed=false')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send()
        .expect(200)

        //Asserting response contain only the completed task

        expect(response.body.length).toBe(1)
})

//////////////////////////////////////////////////////////////////////////////////////////////////




////// Should sort tasks by description/completed/createdAt/updatedAt /////////////////////////////////

test('Should sort tasks by description', async () => { 
    const response = await  request(app).get('/task?sortBy=description:asc')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)

    //Asserting response description in assending order

    expect(response.body[0]).toMatchObject({
        description: 'First Task',
    })
})

test('Should sort tasks by completed', async () => { 
    const response = await  request(app).get('/task?sortBy=completed:asc')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)

    //Asserting response is in a assending order

    expect(response.body[0]).toMatchObject({
        completed : false
    })
})


test('Should sort tasks by createdAt', async () => { 
    const response = await  request(app).get('/task?sortBy=createdAt:asc')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)

    //Asserting response is in a assending order

        expect(response.body[0]).toMatchObject({
            description: 'First Task'
        })
})



test('Should sort tasks by updatedAt', async () => { 
    const response = await  request(app).get('/task?sortBy=createdAt:asc')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)

    //Asserting response is in a assending order

        expect(response.body[0]).toMatchObject({
            description: 'First Task'
        })
}) 

////////////////////////////////////////////////////////////////////////////////////////////////



////// Sort  tasks and create a page //////////////////////////////////////////////////////////

test('Should fetch page of tasks', async () => { 
    const response = await request(app).get('/task?limit=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        // Asserting the filter is correct

        expect(response.body.length).toBe(1)
 })

///////////////////////////////////////////////////////////////////////////////////////////////////



////// Task Updating section  /////////////////////////////////////////////////////////////////////


test('Should  update  user task', async () => { 
    await request(app).patch(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'Updating task'
        })
        .expect(200)

    // Asserting the task was  changed in the database

    const task = await Task.findById(taskOne._id)
    expect(task.description).toBe('Updating task')
})


test('Should not update other users task', async () => { 
    await request(app).patch(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description : 'Updating task'
        })
        .expect(401)

    // Asserting the task was not changed inside the database

    const task = await Task.findOne({'_id' : taskOne._id})
    expect(task.description).toBe('First Task')
})

////////////////////////////////////////////////////////////////////////////////////



///////// Task delete section /////////////////////////////////////////////////////////////

test('Should delete user task', async () => { 
    await request(app).delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Asserting that task was deleted from the database    

    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})



test(`should fail when the third person try to delete a task`, async () => {
    
        await request(app).delete(`/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(401)

        // Asserting the task is stil in the database

        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
})


/////////////////////////////////////////////////////////////////////////////////////////////
 

// Task Test Ideas

// *Should not create task with invalid description/completed

// *Should not update task with invalid description/completed

// *Should delete user task

// *Should not delete task if unauthenticated

// *Should not update other users task

// *Should fetch user task by id

// *Should not fetch user task by id if unauthenticated

// *Should not fetch other users task by id

// *Should fetch only completed tasks

// *Should fetch only incomplete tasks

// *Should sort tasks by description/completed/createdAt/updatedAt

// *Should fetch page of tasks