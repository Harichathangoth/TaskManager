const request = require('supertest')
const User = require('../src/models/user')
const app = require('../src/app')
const { userOneId, userOne, userTwo, setUpDatabase } = require('./fixtures/db')


beforeEach( setUpDatabase )


test('Should SignUp new user', async () => {
    const response = await request(app).post('/user/register').send({
        name : 'Hari',
        age : 22,
        email : 'harichathagoth@gmail.com',
        password : 9633756579
    }).expect(201)

// Assert that the database was changed correctly
    
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
 
// Assertions about the response

    expect( response.body ).toMatchObject({

        user : {
            name : 'Hari',
            email : 'harichathagoth@gmail.com',
       },

       token : user.tokens[0].token
    })

    expect(user.password).not.toBe('9633756579')

})



test('Should not signup user with invalid name', async () => { 
    await request(app).post('/user/register')
        .send({
            age : 22,
            email : 'harichathagoth@gmail.com',
            password : 9633756579
        })
        .expect(400)

        // Assert that the user was not registerd in the database

        const user = await User.find({email : 'harichathagoth@gmail.com'})
        expect(user).toEqual([])
})


test('Should not signup user with invalid email', async () => { 
    await request(app).post('/user/register')
        .send({
            name : 'hari',
            age : 22,
            password : 9633756579
        })
        .expect(400)

        // Assert that the user was not registerd in the database

        const user = await User.find({ name : 'hari' })
        expect(user).toEqual([])
})



test('Should not signup user with invalid password', async () => { 
    await request(app).post('/user/register')
        .send({
            name : 'hari',
            age : 22,
            email : 'harichathagoth@gmail.com'
        })
        .expect(400)

        // Assert that the user was not registerd in the database

        const user = await User.find({ email : 'harichathagoth@gmail.com' })
        expect(user).toEqual([])
}) 


test('Should login existing user', async () => {

    const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    // Fetching user from the database

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Asserting that the token inside the token matches users second token

    expect(response.body.token).toBe(user.tokens[1].token)

})


test('Should not login nonexisting user', async () => {

    await request(app).post('/users/login').send({
        email  : userOne.email,
        password : 'haricshjdf'
    }).expect(404)

})


test('Should get user profile details', async () => {

    await request(app).get('/user/profile')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

})


test('Should not get non athorizied user profile', async () => {

    await request(app).get('/user/profile')
    .send()
    .expect(401)

})




test('Should delete account for user', async () => {
    await request(app).delete('/user/profile')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

     // Check the user has been removed or not

     const user = await User.findById(userOneId)
     expect(user).toBeNull()
})


test('Should not delete account by unauthorized user', async () => {
    await request(app).delete('/user/profile')
        .send()
        .expect(401)

        // Asserting that no user has been deleted

        const users = await User.find()
        expect(users.length).toEqual(2)
}) 


test('Should  upload avatar on user profile', async () => {
    const response = await request(app)
         .post('/user/profile/avatar')
         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
         .attach('avatar', 'test/fixtures/profile-pic.jpg')
         .expect(200)

         const user = await User.findById(userOneId)
         expect(user.avatar).toEqual(expect.any(Buffer))
         
})

test('Should update valid user fields' , async () => {

    const response = await request(app).patch('/user/profile')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    // email : 'harichathagoth@gmail.com',
                    // password : 'harichathangoth',
                    name : 'arjun',
                    // age : 21
                })
                .expect(200)

    // Check response of update

    // console.log(response.body)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('arjun') // toBe is a strict comparison operator (===), so when we expevting '{}',then it's return error

})

test('Should not update invalid user fields', async () => {

    await request(app).patch('/user/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location : 'calicut'
        })
        .expect(406)
})


test(' Should not update user if unauthenticated', async () => { 
    await request(app).patch('/user/profile')
                .send({
                    // email : 'harichathagoth@gmail.com',
                    // password : 'harichathangoth',
                    name : 'arjun',
                    // age : 21
                })
                .expect(401)

            //  Asserting the user database was not changed   
            const user = await User.find({name : 'arjun'})
            expect(user).toEqual([])
})


test('Should not update user with invalid name', async () => { 

    await request(app).patch('/user/profile')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    name : 0,
                })
                .expect(500)

            //  Asserting the user database was not changed   
            const user = await User.find({name : 0})
            expect(user).toEqual([])
})

test('Should not update user with invalid email', async () => { 

    await request(app).patch('/user/profile')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    email : 'harichathangoth',
                })
                .expect(500)

            //  Asserting the user database was not changed   
            const user = await User.find({ email : 'harichathangoth' })
            expect(user).toEqual([])
})


test('Should not update user with invalid password', async () => { 

    await request(app).patch('/user/profile')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    name : 'hari',
                    password : 'haricha',
                })
                .expect(500)

            //  Asserting the user database was not changed   
            const user = await User.find({ email : 'hari' })
            expect(user).toEqual([])
})


 



