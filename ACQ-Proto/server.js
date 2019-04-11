/**
 * Created by rxudsk on 4/10/2019.
 */
const fs = require('fs');
const express = require('express');
const moment = require('moment');
const cors = require('cors');

const nasdaqConnector = require('./nasdaqConnector.js');

var app = express();
app.use(cors());

//app.use(express.static('../UI/dist'));

app.get('/', function (req, res) {
    res.send('ACQ Proto online.');
});

app.get('/api/nasdaq/ready', (req, res) => {
    try {
        res.send(nasdaqConnector.getLoadStatus());
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.get('/api/nasdaq/query', (req, res) => {
    try {
        if (req.query.id) {
            nasdaqConnector.getByID(req.query.id)
                .then(result => res.send(result))
                .catch(error => res.status(500).send("id not valid"));
        } else {
            res.status(501).send("Nothing implemented for parameters.");
        }
    } catch (err) {
        res.send("Error: " + err);
    }
});


app.listen(80);


console.log("Listening on 80.");