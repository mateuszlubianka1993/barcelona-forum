const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://xiedzu1503:mpJaGC9kRel7oPTF@cluster0.oqfff.mongodb.net/forum?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if(_db) {
        
        return _db;
    }
    throw 'No database found.'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
