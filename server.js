const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/Users');
const AccumulationPractic = require('./models/AccumulationPractices');

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
    Users.updateOne({ _id: id }, req.body).then(() => {
        res.status(204).send('Updated successfully');
    })
})
//login
app.post('./login', (req, res) => {

})
//password





app.listen(3001, () => {
    console.log("Server is Running")
})