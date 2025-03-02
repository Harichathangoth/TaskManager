const mongodb = require('mongodb')

const { MongoClient, ObjectID } = mongodb
const uri = "mongodb+srv://hari:9633756579@learnclustor.wewmmxh.mongodb.net/?retryWrites=true&w=majority&appName=LearnClustor";
const databaseName = `task-manager`;

const id = new ObjectID()
console.log(id)

MongoClient.connect(uri, { useNewUrlParser : true }, (error, client) => {
    if(error){
        console.log(`Unable to connect to the database`);
    }else{
        console.log(`Successfully connected to the database`);

        const db = client.db( databaseName );



        //C - CREATION OF DATA

    //     db.collection('task').insertMany([{
    //         task : 'javascript',
    //         completed : true
    //     },
    //     {
    //         task : 'node',
    //         completed : false
    //     },
    //     {
    //         task : 'react',
    //         completed : false
    //     }
    // ], ( error, result ) => {
    //     if(error){
    //         console.log(`failed to add data into database`);
    //     }else{
    //         console.log(result);
    //     }
    // })




    // R - Reading the data inside tha data base

    // db.collection('task').find({ completed : false }).toArray(( error, data ) => {
    //     console.log(data)
    // });

    // db.collection('task').find({ completed : false }).count(( error, count ) =>{
    //     console.log(`The total number of collections : `,count);
    // } )

    //Task 1
    
    // U - Updating the data inside the data base

    // db.collection('task').updateMany({ completed : true }, { 
    //     $set : {
    //         completed : false
    //     },
    //     $inc : {
    //         no : 10
    //     }
    //  }).then(( result ) => {
    //     console.log(result);
    //  }).catch(( error ) => {
    //     console.log(error);
    //  })

    // db.collection('task').updateOne({ completed : false },{
    //     $inc : {
    //         no : -10
    //     },
    //     $set : {
    //         completed : true
    //     }
    // }).then(( result ) => {
    //     console.log(result.modifiedCount);
    // }).catch(( error ) => {
    //         console.log(error);
    //      })

    // D - deleting the data inside the data base 

    // db.collection('task').deleteOne({ task : 'mongodb' }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //      console.log(error);
    // });

    db.collection('task').deleteMany({ no : 16 }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })


    }
})













// const mongodb = require('mongodb');


// const MongoClient = mongodb.MongoClient
// const connectionURL = "mongodb+srv://harichathangoth:9633756579@cluster0.fyawhdm.mongodb.net/?appName=Cluster0";
// const databaseName = "task-manger"




// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
//     if(error){
//         console.log(`Unable to connect to database..!!`);
//     }else{
//         console.log(`Successfully connected to database`);
//        const db = client.db(databaseName);

//       db.collection('task').insertMany([{
//         task: 'javascript',
//         completed: true
//       },{
//         task:'node',
//         completed: false
//       },{
//         task:'react',
//         completed: false
//       }],(error, result) => {
//         if(error){
//             console.log(`failed to insert the data..!!`);
//         }else{
//             console.log(result);
//         }
//       })
//     }
// })




// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://harichathangoth:9633756579@cluster0.fyawhdm.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
