const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//token verification
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

// database connection 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ham2h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// Getting all card 

async function run(){
    try{
        await client.connect();
        const carCollection = client.db('cuteCar').collection('cars');
        
        //ACCESS_TOKEN_SECRET

        // AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })


        app.get('/cars',async(req,res)=>{
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        });

        // Getting sigle cars 
        app.get('/cars/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const cars = await carCollection.findOne(query);
            res.send(cars);
        });

         // POST api or adding a new car
         app.post('/cars', async(req, res) =>{
            const newcars = req.body;
            const result = await carCollection.insertOne(newcars);
            res.send(result);
        });

         // DELETE or removing a car
         app.delete('/cars/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await carCollection.deleteOne(query);
            res.send(result);
        });

        //   // update cars
        //   app.put('/cars/:id', async(req, res) =>{
        //     const id = req.params.id;
        //     const updatedCars = req.body;
        //     const filter = {_id: ObjectId(id)};
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             quantity: updatedCars.quantity,
                    
        //         }
        //     };
        //     const result = await carCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);

        // })

         // update quantity and sold
         app.put('/cars/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedCars = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedCars.quantity,
                    sold: updatedCars.sold,
                    
                }
            };
            const result = await carCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

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