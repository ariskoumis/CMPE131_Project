/**
 * Module dependencies.
 */
const database  = {};

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 */
database.mongoclient    = require('mongodb').MongoClient;
database.url            = "mongodb://calvin:q1w2e3r4@ds251819.mlab.com:51819/cmpe-it" || "mongodb://localhost:27017";

/**
 * Initialize Database
 */
database.init = function() {
  database.mongoclient.connect(database.url, function(err, client) {
    if (err) throw err;
    console.log("Database Created");
    // Uncomment if you want to reset any variable in the database
    // var db = client.db("cmpe-it");
    // db.collection('users').update({}, { $unset:
    //   {
    //     "admin": false
    //     // "dislikedUser": [],
    //     // likes: 0,
    //     // dislikes: 0
    //   }
    // }, {
    //   upsert:false,
    //   multi:true
    // });
    client.close();
  });
};

module.exports = database;
