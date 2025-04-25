require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to log requests
app.use(function (req, res, next) {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Serve "Hello Express" at the root route
app.get("/", (req, res) => res.send("Hello Express"));

// Serve index.html at /views/index.html for the / route if needed
// app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

app.use("/public", express.static(__dirname + "/public"));

// Route for /json
app.get("/json", (req, res) => {
    const json = { message: "Hello json" };
    json.message = process.env.MESSAGE_STYLE === "uppercase" ? json.message.toUpperCase() : json.message;
    res.json(json);
});

// Route for /now that adds the current timestamp
app.get("/now", (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => res.json({ time: req.time }));

// Route for /:word/echo that echoes the word
app.get("/:word/echo", (req, res) => res.json({ echo: req.params.word }));

// Route for /name that handles both GET and POST requests
app.route("/name")
    .get((req, res) => {
        res.json({ name: `${req.query.first} ${req.query.last}` });
    })
    .post((req, res) => {
        res.json({ name: `${req.body.first} ${req.body.last}` });
    });

// Export the app module
module.exports = app;

console.log("Hello World");
