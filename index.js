const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// database connection 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ham2h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("CuteCar").collection("cars");
//   // perform actions on the collection object
//   console.log('Mongo is connected');
//   client.close();
// });

async function run(){
    try{
        await client.connect();
        const carCollection = client.db('cuteCar').collection('cars');

        app.get('/cars',async(req,res)=>{
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Cute server is running')
});

app.listen(port, ()=>{
    console.log('Cute car running on port 5000');
})