const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const AccumulationPractic = require('./models/AccumulationPractices');
const UsersAccount = require('./models/UsersAccount');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://yargoMongo:12345@cluster.eoost.mongodb.net/Finplanner?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open", () => {
    console.log("Connection to DB established");
});

let tokens = [];
let users = [];

//GET на /users
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
    user.save((err) => {
        if (err) {
            return res.status(500).json();
        }
        res.status(201).json(user);
        console.log('User created');
    })
})

app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    User.updateOne({ _id: id }, { name: req.body.name, typeOfAccumulation: req.body.typeOfAccumulation })
        .then(() => {
            res.status(204).send('Updated successfully');
        });
});

app.post('/accumulationnew', async (req, res) => {
    // console.log("req.body",req.body);
    if (req.body.name === "Эффект латте" || req.body.name === "Обнуление") {
        let result = await AccumulationPractic.findOneAndUpdate({ "name": req.body.name }, { $inc: { "percent.save": req.body.value } },
            { new: true }
        )
        let newValue = await AccumulationPractic.findOne({ "name": req.body.name }).exec();
        console.log("newValue", newValue.percent);
        console.log("req.body.name", req.body.name);
        res.json(newValue.percent.save);
    }

    if (req.body.name === "50/30/20") {
        console.log("req.body", req.body);
        let result = await AccumulationPractic.findOneAndUpdate(
            { "name": req.body.name },
            { $inc: { "percent.basic": req.body.basic,"percent.desired": req.body.desired,"percent.accumulation": req.body.accumulation } },
            { new: true }
        )
        console.log("result,50/30/20", result);

        let newValue = await AccumulationPractic.findOne({ "name": req.body.name }).exec();
        console.log("newValue,50/30/20", newValue.percent);
        console.log("req.body.name,5/3/2", req.body.name);
        res.json(newValue.percent);
    }

    if (req.body.name === "Шесть кувшинов") {
        console.log("req.body", req.body);
        let result = await AccumulationPractic.findOneAndUpdate(
            { "name": req.body.name },
            { $inc: { 
                "percent.main": req.body.main,
                "percent.accumulation": req.body.accumulation,
                "percent.expensive_purchases": req.body.expensive_purchases,
                "percent.self_development_and_hobbies": req.body.self_development_and_hobbies,
                "percent.squander": req.body.squander,
                "percent.presents": req.body.presents 
            } },
            { new: true }
        )
        console.log("result,50/30/20", result);

        let newValue = await AccumulationPractic.findOne({ "name": req.body.name }).exec();
        console.log("newValue,50/30/20", newValue.percent);
        console.log("req.body.name,5/3/2", req.body.name);
        res.json(newValue.percent);
    }

    if (req.body.name === "Четыре конверта") {
        console.log("req.body", req.body);
        let result = await AccumulationPractic.findOneAndUpdate(
            { "name": req.body.name },
            { $inc: { 
                "percent.financialPurposes": req.body.financialPurposes,
                "percent.mandatorySpend": req.body.mandatorySpend,
                "percent.convert": req.body.convert
            } },
            { new: true }
        )
        console.log("result,50/30/20", result);

        let newValue = await AccumulationPractic.findOne({ "name": req.body.name }).exec();
        console.log("newValue,50/30/20", newValue.percent);
        console.log("req.body.name,5/3/2", req.body.name);
        res.json(newValue.percent);
    }

    if (req.body.name === "Сейф") {
        let result = await AccumulationPractic.findOneAndUpdate(
            { "name": req.body.name }, 
            { $inc: { "percent.save": req.body.save } },
            { new: true }
        )
        let newValue = await AccumulationPractic.findOne({ "name": req.body.name }).exec();
        console.log("newValue", newValue.percent);
        console.log("req.body.name", req.body.name);
        res.json(newValue.percent.save);
    }

})

app.get('/accumulation', (req, res) => {
    AccumulationPractic.find().then((data) => {
        res.status(200).json(data)
    })
})
// app.get("/users", (req, res) => {
//     User.find()
//         .then((data) => {
//             console.log("OK"),
//                 res.status(200).json(data)
//         })
// })

app.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    UsersAccount.findOne({ login: login })
        .then((user) => {
            if (user && user.hashPassword === bcrypt.hashSync(password, user.salt)) {
                const newToken = uuid.v4();
                tokens.push({ login: req.body.login, token: newToken });
                res.status(201).json(newToken);
            } else {
                res.status(401).send("Неправильный логин или пароль!");
            }
        });
});

app.post('/reqister', (req, res) => {
    const salt = bcrypt.genSaltSync(7);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    let account = new UsersAccount({ login: req.body.login, salt: salt, hashPassword: hashPassword });
    account.save();
    newToken = uuid.v4();
    tokens.push({ login: req.body.login, token: newToken });
    res.status(201).json(newToken);

});

app.listen(3000, () => {
    console.log("Server start");
});
