const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const AccumulationPractic = require('./models/AccumulationPractices');
const UsersAccount = require('./models/UsersAccount');
const uuid = require('uuid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://yargoMongo:12345@cluster.eoost.mongodb.net/Finplanner?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open", () => {
    console.log("Connection to DB established");
});

let tokens =[];
let users = [];

//GET на /users

app.get("/users", (req, res) => {
    User.find()
        .then((data) => {
            console.log("OK"),
                res.status(200).json(data)
        })
})

//GET на /users/:id
app.get("/users/:id", (req, res) => {
    let id = +req.params.id;
    console.log(id);

    User.find({ _id: id })
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((err) => {
            console.log(err);
        })
})



//POST на /users
app.post("/users", (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save((err)=> {
        if(err){
            return res.status(500).json();
        }
        res.status(201).json(user);
        console.log('User created');
    })
})


//PUT на /users/:id
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    User.updateOne( { _id: id}, { name: req.body.name, typeOfAccumulation: req.body.typeOfAccumulation } )
    .then(() => {
        res.status(204).send('Updated successfully');
    });
});
//login
app.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    UsersAccount.findOne( {login: login} )
    .then((user) => {
        if(user && user.hashPassword === bcrypt.hashSync(password, user.salt)){
            const newToken = uuid.v4();
            tokens.push({login : req.body.login, token: newToken});
            res.status(201).json(newToken);
        } else {
            res.send("Неправильный логин или пароль!");
        }
    });
});
//register
app.post('/reqister', (req, res) => {
    const salt = bcrypt.genSaltSync(7);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    let account = new UsersAccount( { login: req.body.login, salt: salt, hashPassword: hashPassword } );
    account.save();
    newToken = uuid.v4();
    tokens.push({login : req.body.login, token: newToken});
    res.status(201).json(newToken);
        
});

app.listen(3000, () => {
    console.log("Server start");
});
