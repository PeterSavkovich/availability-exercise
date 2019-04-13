const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/today", (req, res) => {
    res.send({
        today: today()
    });
});

function today() {
    return new Date().toLocaleDateString();
}

app.today = today;
module.exports = app;

app.get("/availability", (req, res, next) => {
    request("https://www.thinkful.com/api/advisors/availability", (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            next(error);
        }
    });
    res.send({});
});