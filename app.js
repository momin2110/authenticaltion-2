// database encryption authentication
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Users = require('./models/user.model');
const app = express();

const port = process.env.PORT || 5000;
const url = process.env.MONGO_URL;

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).sendFile(__dirname + '/./views/index.html')
});
app.post('/register', async (req, res)=>{
    try {
        const {email, password} = req.body; 
        const newUser = new Users({email, password});
        await newUser.save();
        res.status(201).json({newUser})
    } catch (error) {
        res.status(500).json(error)
    }
});
app.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body; 
        const user = await Users.findOne({email : email});
        if(user && user.password === password){
            res.status(201).json({status : "Valid user"})
        }else{
            res.status(404).json({status : "Not a valid user"})
        }
    } catch (error) {
        res.status(500).json(error)
    }
});

app.use((req, res, next)=>{
    res.status(404).send(`404 error !!! Route not found`)
});
app.use((err, req, res, next)=>{
    res.status(500).send('!!! Something broke')
});

mongoose.connect(url)
.then(()=>{
    console.log(`Mongodb is connected successfully`);
})
.catch((error)=>{
    console.log(error);
    process.exit(1);
})
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});