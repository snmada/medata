const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(
    session({
        key : 'userID',
        secret: 'dotenv',
        resave: false,
        saveUninitialized: false,
        cookie:{
            expires: 60*60*24,
        }
    })
);

app.listen(3001, () => {
    console.log("running server");
});

module.exports = app;