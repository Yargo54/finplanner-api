const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const AccumulationPractic = require('./models/AccumulationPractices');
const UsersAccount = require('./models/UsersAccount');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://yargoMongo:12345@cluster.eoost.mongodb.net/Finplanner?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open", () => {
    console.log("Connection to DB established");
});

//GET на /users
//GET на /users/:id
//POST на /users

//PUT на /users/:id
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    User.updateOne( { _id: id}, { name: req.body.name, typeOfAccumulation: req.body.typeOfAccumulation } ).then(() => {
        res.status(204).send('Updated successfully');
    });
});
//login
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
//register
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