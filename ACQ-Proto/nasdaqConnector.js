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

const compareExcludingNA = (a, b) => {
    if (a === 'n/a') {
        return -1;
    }

    if (b === 'n/a') {
        return 1;
    }
    return a.localeCompare(b);
};

var nasdaqLoaded = false;
var distinctSector = [];
var distinctIndustry = [];
nasdaqDB.count({}, (err, count) => {
    let insertCount = 0;
    let sectorAccum = {};
    let industryAccum = {};
    if (count === 0) {
        let accumDone = false;
        let insertDone = false;
        console.log("NasdaqDB is empty.");
        let nasdaqData = require('./dummy_data/nasdaq_data.json');

        nasdaqData.forEach((datum) => {
            datum.Symbol = datum.Symbol.trim();
            datum.Name = datum.Name.trim();
            datum.Sector = datum.Sector.trim();
            datum.Industry = datum.Industry.trim();
            datum.MarketCap = parseMarketCap(datum.MarketCap);

            sectorAccum[datum.Sector] = null;
            industryAccum[datum.Industry] = null;

            nasdaqDB.insert(datum, (err, newDatum) => {
                if (err) {
                    console.log(err);
                    console.log(JSON.stringify(newDatum, null, 4));
                }

                if (++insertCount === nasdaqData.length) {
                    console.log("NasdaqDB has been populated.");
                    insertDone = true;
                    nasdaqLoaded = accumDone && insertDone;
                    if (nasdaqLoaded) console.log("Setup complete.");
                }
            });
        });

        distinctSector = Object.keys(sectorAccum)
            .sort(compareExcludingNA);

        distinctIndustry = Object.keys(industryAccum)
            .sort(compareExcludingNA);

        accumDone = true;
        nasdaqLoaded = accumDone && insertDone;
        if (nasdaqLoaded) console.log("Setup complete.");
    } else {
        console.log("NasdaqDB is not empty.");
        nasdaqDB.find({}, (err, docs)=> {
            if (err) {
                console.log(err);
            }

            docs.forEach((datum) => {
                sectorAccum[datum.Sector] = null;
                industryAccum[datum.Industry] = null;
            });

            distinctSector = Object.keys(sectorAccum)
                .sort(compareExcludingNA);
            distinctIndustry = Object.keys(industryAccum)
                .sort(compareExcludingNA);

            nasdaqLoaded = true;
            console.log("Setup complete.");
        });
    }
});

const getWorkItemById = (id) => {
    return new Promise((resolve, reject) => {
        nasdaqDB.find({"_id": id}, (err, docs) => {
            if (err) {
                console.log(err);
            }

            if (docs.length === 1) {
                let workItem = docs[0];
                delete workItem._id;
                workItem.Status = "0";
                workItem.KeyContacts = [
                    {name: "Person McPerson", contact: "123-45-7890"},
                    {name: "Real O'Person", contact: "roper@corp.com"}
                ];
                resolve(workItem);
            }
            reject(null);
        });
    });
};

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
        nasdaqDB.find(filter)
            .sort({Name: 1})
            .exec((err, docs) => {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
    });
};

const getFirstN = (limit) => {
    return new Promise((resolve, reject) => {
        nasdaqDB
            .find({})
            .sort({Name: 1})
            .limit(limit)
            .exec((err, docs) => {
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
    getDistinctSector: () => {
        return distinctSector;
    },
    getDistinctIndustry: () => {
        return distinctIndustry;
    },
    getWorkItemById: getWorkItemById,
    getByOthers: queryByOthers,
    getFirstN: getFirstN
};

module.exports = nas_base;
