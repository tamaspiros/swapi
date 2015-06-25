'use strict';

var joi         = require('joi');
var MongoClient = require('mongodb').MongoClient;
var connection  = require('./connection');
var dburl       = connection.url;

var findDocuments = function(db, callback) {
  var collection = db.collection('films');
  collection.find({}, {_id: 0}).toArray(function(err, docs) {
    callback(docs);
  });
};

var findOne = function(db, episodeNo, callback) {
  var episodeNo = Number(episodeNo);
  var collection = db.collection('films');
  collection.findOne({episode: episodeNo}, {_id: 0}, function(err, doc) {
    callback(doc);
  });
}

exports.allFilmsHandler = {
  handler: function(request, response) {
    MongoClient.connect(dburl, function(err, db) {
      if (err) {
        console.log(err);
      }

      findDocuments(db, function(docs) {
        response(docs);
        db.close();
      });
    });
  }
}

exports.oneFilmHandler = {
  validate: {
    params: {
      episodeno: joi.number().min(1).max(6)
    }
  },
  handler: function(request, response) {
    var episodeNo = request.params.episodeno;
    MongoClient.connect(dburl, function(err, db) {
      if (err) {
        console.log(err);
      }
      findOne(db, episodeNo, function(doc) {
        response(doc);
        db.close();
      })
    });
  }
}
