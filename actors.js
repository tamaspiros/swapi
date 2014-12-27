'use strict';

var joi         = require('joi');
var MongoClient = require('mongodb').MongoClient;
var connection  = require('./connection');
var dburl       = connection.url;

var findOneActor = function(db, lname, callback) {
  var lname = String(lname);
  var collection = db.collection('actors');
  collection.findOne({'name': { '$regex': lname, $options: 'i' }}, {_id: 0}, function(err, doc) {
    callback(doc);
  });
}

exports.actorHandler = {
  validate: {
    params: {
      lname: joi.string().min(1).max(25)
    }
  },
  handler: function(request, response) {
    var lname = request.params.lname;
    MongoClient.connect(dburl, function(err, db) {
      if (err) {
        console.log(err);
      }
      findOneActor(db, lname, function(doc) {
        response(doc);
        db.close();
      })
    });
  }
};
