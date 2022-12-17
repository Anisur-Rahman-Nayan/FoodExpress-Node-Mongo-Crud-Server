const express = require('express')
const app = express()
require('dotenv').config()
var cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

// Use Middleware

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// user: dbuser1
// password: 29mfokkrbPQ8WX2m



const uri = `mongodb+srv://${process.env.DB_USER }:${process.env.DB_PASS}@cluster0.uqgfx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");

    // const user ={name:"Anisur Rahman Nayan", email:"arnayan21@gmail.com"}
    // const result = await userCollection.insertOne(user);
    // console.log(`User inserted with the _id: ${result.insertedId}`);
    
    app.get('/user', async (req,res)=>{
      const query = {};
      const cursor = userCollection.find(query)
      const user = await cursor.toArray();
      res.send(user)
    })

    app.get('/user/:id' , async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    app.post('/user',async (req,res)=>{
      const newUser = req.body;
      console.log('Adding New User !',newUser)
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })

    app.put('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)}
      const options = { upsert: true};
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        }
      };
      const result = await userCollection.updateOne(filter, updatedDoc,options)
      res.send(result)
    })

    app.delete('/user/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })


  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})