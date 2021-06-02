const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const AccumulationPractic = require('./models/AccumulationPractices');
const UsersAccount = require('./models/UsersAccount');

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

app.get("/users", (req, res) => {
    User.find()
        .then((data) => {
            console.log("OK"),
                res.status(200).json(data)
        })
})

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

app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    User.updateOne( { _id: id}, { name: req.body.name, typeOfAccumulation: req.body.typeOfAccumulation } ).then(() => {
        res.status(204).send('Updated successfully');
    });
});

app.post('/accumulationnew', (req, res) => {
    const practic = new AccumulationPractic (req.body);
    practic.save();
    res.json(practic);
})

app.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    UsersAccount.findOne( {login: login} ).then((user) => {
        if(user && user.hashPassword === bcrypt.hashSync(password, user.salt)){
            res.send("Вы вошли!");
        } else {
            res.send("Неправильный логин или пароль!");
        }
    });
});

app.post('/reqister', (req, res) => {
    const salt = bcrypt.genSaltSync(7);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    let account = new UsersAccount( { login: req.body.login, salt: salt, hashPassword: hashPassword } );
    account.save();
    res.send('OK');
});

app.listen(3000, () => {
    console.log("Server start");
});
