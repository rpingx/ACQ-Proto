/**
 * Created by rxudsk on 4/11/2019.
 *
 * So this connector is much simpler since this test is about showing a frontend functionality.
 *
 * Just need the nasdaqConnector to give app a lot more base data functionality.
 */


const Dstore = require('nedb-core');

var workspaceDB = new Dstore({filename: './datastore/workspace.db', autoload: true});


const getAllWorkSpaceDocs = () => {
    return new Promise((resolve, reject) => {
        workspaceDB.find({}, (err, docs) => {
            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
};

const insertDocs = (docs) => {
    return new Promise((resolve, reject) => {
        workspaceDB.insert(docs, (err) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
};

const work_base = {
    getAllItems: getAllWorkSpaceDocs,
    insertItems: insertDocs
};

module.exports = work_base;