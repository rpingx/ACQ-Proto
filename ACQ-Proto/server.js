/**
 * Created by rxudsk on 4/10/2019.
 */
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const nasdaqConnector = require('./nasdaqConnector.js');
const workspaceConnector = require('./workspaceConnector.js');

var app = express();

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(cors());

app.use(express.static('./UI/dist'));

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
            nasdaqConnector.getWorkItemById(req.query.id)
                .then(result => res.send(result))
                .catch(error => res.status(500).send("id not valid"));
        } else if (req.query.filter) {
            nasdaqConnector.getByOthers(req.query.filter)
                .then(result => res.send(result))
                .catch(error => res.status(500).send(error));
        } else {
            res.status(501).send("Nothing implemented for parameters.");
        }
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.get('/api/nasdaq/distinctSector', (req, res) => {
    try {
        res.send(nasdaqConnector.getDistinctSector());
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.get('/api/nasdaq/distinctIndustry', (req, res) => {
    try {
        res.send(nasdaqConnector.getDistinctIndustry());
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.get('/api/nasdaq/queryFirstN', (req, res) => {
    try {
        if (req.query.limit) {
            nasdaqConnector.getFirstN(req.query.limit)
                .then(result => res.send(result))
                .catch(error => res.status(500).send(error));
        } else {
            nasdaqConnector.getFirstN(0)
                .then(result => res.send(result))
                .catch(error => res.status(500).send(error));
        }
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.post('/api/mock/load', (req, res) => {
    try {
        workspaceConnector.empty().then(()=> {
            nasdaqConnector.getFirstN(req.body.count)
                .then((result) => {
                    if (result.length === 0) {
                        res.send("Complete");
                    }

                    let counter = 0;

                    result.forEach((obj) => {
                        let id = obj._id;
                        nasdaqConnector.getWorkItemById(id)
                            .then((result2)=> {

                                try {
                                    result2.Price = Number(result2.Price);
                                } catch (e) {
                                    console.log("updateById Price error: " + e);
                                    result2.Price = null;
                                }

                                try {
                                    result2.MarketCap = Number(result2.MarketCap);
                                } catch (e) {
                                    console.log("updateById MarketCap error: " + e);
                                    result2.MarketCap = null;
                                }

                                try {
                                    result2.IPOYear = Number(result2.IPOYear);
                                } catch (e) {
                                    console.log("updateById IPOYear error: " + e);
                                    result2.IPOYear = null;
                                }

                                workspaceConnector.insertItems(result2)
                                    .then(()=> {
                                        if (++counter === result.length) {
                                            res.send("Complete");
                                        }
                                    });
                            });
                    });
                })
                .catch(error => res.status(500).send(error));
        });
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.get('/api/workspace/items', (req, res) => {
    try {
        workspaceConnector.getAllItems()
            .then(result => res.send(result))
            .catch(error => res.status(500).send(error));
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.post('/api/workspace/items/add', (req, res) => {
    try {
        workspaceConnector.insertItems(JSON.parse(req.body.item))
            .then((result) => {
                res.send(result);
            })
            .catch(error => res.status(500).send(error));
    } catch (err) {
        res.send("Error: " + err);
    }
});

//Pretty sure these two should be puts... might fix it later.
app.post('/api/workspace/items/delete', (req, res) => {
    try {
        workspaceConnector.deleteById(req.body.id)
            .then((result) => {
                res.send(result + " removed");
            })
            .catch(error => res.status(500).send(error));
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.post('/api/workspace/items/update', (req, res) => {
    try {
        workspaceConnector.updateById(req.body.id, JSON.parse(req.body.item))
            .then((result) => {
                res.send(result + " updated");
            })
            .catch(error => res.status(500).send(error));
    } catch (err) {
        res.send("Error: " + err);
    }
});

app.listen(80);

console.log("Listening on 80.");