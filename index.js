const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Cute server is running')
});

app.listen(port, ()=>{
    console.log('Cute car running on port 5000');
})