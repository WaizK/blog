const express = require('express');
const app = express();
app.use(express.static("./"));
const mongoose = require('mongoose');
const cipher = require('./utils/cipher')
require('dotenv').config()

app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/blogDB')
app.use(express.urlencoded({ extended: true }))

const blogAuthSchema = new mongoose.Schema({
    username: { type: String , required: true },
    password: { type: String , required: true },
})

const User = mongoose.model('User', blogAuthSchema)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/auth-home.html');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})
app.get('/logout', (req, res)=>{
    res.redirect('/')
})
app.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const newUser = new User({username:username, password:cipher(password, process.env.SHIFT)})
    newUser.save(err=>{
        if(!err){
            res.sendFile(__dirname + '/pages/index.html')
        }else console.log(err)
    })
    })

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username:username}, (err, foundUser)=>{
        if(!err){
            if(foundUser){
                if(foundUser.password === cipher(password, process.env.SHIFT)){
                    res.sendFile(__dirname + '/pages/index.html')
                }else res.send('Password Incorrect')
            }else res.send("User has not been found")
        }else{
            res.send(err);
        }
    })

})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server started on port: ' + PORT);
})