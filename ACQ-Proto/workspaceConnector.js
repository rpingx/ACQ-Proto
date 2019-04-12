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

const deleteAllDocs = () => {
    return new Promise((resolve, reject) => {
        workspaceDB.remove({}, {multi: true}, (err, numRemoved) => {
            if (err) {
                reject(err);
            }

            workspaceDB.loadDatabase(function (error) {
                if (error) {
                    reject(error);
                }
                resolve(numRemoved);
            });
        });
    });
};

const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        workspaceDB.remove({_id: id}, {}, (err, numRemoved) => {
            if (err) {
                reject(err);
            }

            resolve(numRemoved);
        });
    });
};

const updateById = (id, doc) => {
    return new Promise((resolve, reject) => {
        workspaceDB.update({_id: id}, doc, {}, (err, numReplaced) => {
            if (err) {
                reject(err);
            }

            resolve(numReplaced);
        });
    });
};

const work_base = {
    getAllItems: getAllWorkSpaceDocs,
    insertItems: insertDocs,
    empty: deleteAllDocs,
    deleteById: deleteById,
    updateById: updateById
};

module.exports = work_base;