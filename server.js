const express = require('express');
const mongoose = require('mongoose');

const Users = require('./models/Users');
const AccumulationPractic = require('./models/AccumulationPractices');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://yargoMongo:12345@cluster.eoost.mongodb.net/myapp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

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
    Users.updateOne({ _id: id }, req.body).then(() => {
        res.status(204).send('Updated successfully');
    })
})
//login
app.post('./login', (req, res) => {
    
})
//password