/**
 * Created by rxudsk on 4/11/2019.
 */

const Dstore = require('nedb-core');

var nasdaqDB = new Dstore({filename: './datastore/nasdaq.db', autoload: true});

const isNumeric = (val) => {
    return Number(parseFloat(val)) === val;
};

const parseMarketCap = (origCap) => {
    if (isNumeric(origCap)) {
        return parseFloat((origCap / 1000000).toFixed(2));
    }

    if (origCap.includes("n/a")) {
        return origCap;
    }

    let floatCap = parseFloat(origCap);

    if (isNaN(floatCap)) {
        floatCap = parseFloat(origCap.substring(1));
    }

    if (origCap.includes("B")) {
        floatCap *= 1000;
    }

    return parseFloat(floatCap.toFixed(2));
};

var nasdaqLoaded = false;
nasdaqDB.count({}, (err, count) => {
    if (count === 0) {
        console.log("NasdaqDB is empty.");
        let nasdaqData = require('./dummy_data/nasdaq_data.json');

        nasdaqData.forEach((datum) => {
            datum.Symbol = datum.Symbol.trim();
            datum.Name = datum.Name.trim();
            datum.Sector = datum.Sector.trim();
            datum.Industry = datum.Industry.trim();
            datum.MarketCap = parseMarketCap(datum.MarketCap);

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

const queryByOthers = (filterObj) => {
    filterObj = JSON.parse(filterObj);
    let filter = {$and: []};

    if (filterObj.industry) {
        filter.$and.push({Industry: filterObj.industry});
    }

    if (filterObj.sector) {
        filter.$and.push({Sector: filterObj.sector});
    }

    if (filterObj.text) {
        filter.$and.push({$or: [{Symbol: new RegExp(filterObj.text, 'i')}, {Name: new RegExp(filterObj.text, 'i')}]});
    }

    if (filterObj.ipoYearMin) {
        filter.$and.push({IPOYear: {$gte: filterObj.ipoYearMin}});
    }
    if (filterObj.ipoYearMax) {
        filter.$and.push({IPOYear: {$lte: filterObj.ipoYearMax}});
    }

    if (filterObj.marketCapMin) {
        filter.$and.push({MarketCap: {$gte: filterObj.marketCapMin}});
    }
    if (filterObj.marketCapMax) {
        filter.$and.push({MarketCap: {$lte: filterObj.marketCapMax}});
    }

    if (filterObj.priceMin) {
        filter.$and.push({Price: {$gte: filterObj.priceMin}});
    }
    if (filterObj.priceMax) {
        filter.$and.push({Price: {$lte: filterObj.priceMax}});
    }

    return new Promise((resolve, reject) => {
        nasdaqDB.find(filter, function (err, docs) {
            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
};

const nas_base = {
    getLoadStatus: () => {
        return nasdaqLoaded;
    },
    getByID: (id) => {
        return new Promise((resolve, reject) => {
            nasdaqDB.find({"_id": id}, function (err, docs) {
                if (err) {
                    console.log(err);
                }

                if (docs.length === 1) {
                    resolve(docs[0]);
                }
                reject(null);
            });
        });
    },
    getByOthers: queryByOthers
};

module.exports = nas_base;
