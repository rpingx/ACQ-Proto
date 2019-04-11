/**
 * Created by rxudsk on 4/11/2019.
 */

const Dstore = require('nedb');

var nasdaqDB = new Dstore({filename: './datastore/nasdaq.db', autoload: true});

var nasdaqLoaded = false;
nasdaqDB.count({}, (err, count) => {
    if (count === 0) {
        console.log("NasdaqDB is empty.");
        let nasdaqData = require('./dummy_data/nasdaq_data.json');
        nasdaqData.forEach((datum) => {
            nasdaqDB.insert(datum, (err, newDatum) => {
                if (err) {
                    console.log(err);
                    console.log(JSON.stringify(newDatum, null, 4));
                }
            });
        });
        console.log("NasdaqDB has been populated.");
        nasdaqLoaded = true;
    } else {
        console.log("NasdaqDB is not empty.");
        nasdaqLoaded = true;
    }
});


const nas_base = {
    getLoadStatus: () => {
        return nasdaqLoaded;
    },
    getByID: (id) => {
        return new Promise((resolve, reject) => {
            nasdaqDB.find({ "_id": id}, function (err, docs) {
                if (err) {
                    console.log(err);
                }

                if (docs.length === 1) {
                    resolve(docs[0]);
                }
                reject(null);
            });
        });
    }
};

module.exports = nas_base;
