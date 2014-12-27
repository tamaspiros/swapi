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

  if (episodeNo === 1) {
    var title = 'Star Wars: Episode I - The Phantom Menace';
  } else if (episodeNo === 2) {
    var title = 'Star Wars: Episode II - Attack of the Clones';
  } else if (episodeNo === 3) {
    var title = 'Star Wars: Episode III - Revenge of the Sith';
  } else if (episodeNo === 4) {
    var title = 'Star Wars: Episode IV - A New Hope';
  } else if (episodeNo === 5) {
    var title = 'Star Wars: Episode V - The Empire Strikes Back';
  } else {
    var title = 'Star Wars: Episode VI - Return of the Jedi';
  }

  var collection = db.collection('films');

  collection.findOne({title: title}, {_id: 0}, function(err, doc) {
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
