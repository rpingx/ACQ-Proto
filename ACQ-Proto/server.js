/**
 * Created by rxudsk on 4/10/2019.
 */
const fs = require('fs');
const express = require('express');
const moment = require('moment');
const cors = require('cors');

var app = express();
app.use(cors());

//app.use(express.static('../UI/dist'));

app.get('/', function (req, res) {
    res.send('ACQ Proto online.');
});

app.listen(80);


console.log("Listening on 80.");