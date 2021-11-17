//This express
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
//initialize
const app = express();

//This is port 

const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());


///raw data

let users = [
    // { id: 1, name: 'A', mail: 'a@a.com' },
    // { id: 2, name: 'B', mail: 'b@a.com' },
    // { id: 3, name: 'C', mail: 'a@a.com' },
    // { id: 4, name: 'D', mail: 'D@a.com' },
    // { id: 5, name: 'E', mail: 'E@a.com' }
];

//root get api
app.get('/', (req, res) => {
    res.send('Your server running')
});


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.umkog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("reach-travel");
        const services_Collection = database.collection("services");
        //load services get api
        app.get('/services', async (req, res) => {
            const cursor = services_Collection.find({});
            const count = await cursor.count();
            const services = await cursor.toArray();
            res.json(services);

        });

        //load single services get api
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await services_Collection.findOne(query);
            res.json(service);
        });

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

// app.get('/users', (req, res) => {
//     //console.log("This is users");
//     res.send(users);
// });

// //user add post api 
// app.post("/users/add", (req, res) => {
//     const user = req.body;
//     const id = parseInt(Math.random() * 1000000000);
//     const modifiedUser = { id: id, name: user.name, mail: user.mail };
//     users.push(modifiedUser);
//     res.json("user added");
// });

// //user delete api 

// app.delete('/users/:id', (req, res) => {
//     const id = req.params.id;
//     console.log(users);
//     const remainingUser = users.filter((user) => user.id !== Number(id));
//     users = remainingUser;
//     res.json('deleted');
// }); 


app.listen(port, () => {
    console.log("server is running on port", port);
})