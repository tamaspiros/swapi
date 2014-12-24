/*
/films
  title
  plot
  duration
  imdbscore
  cast []
  director

/actors
  name
  gender
  birthday

*/
var hapi        = require('hapi');
var joi         = require('joi');
var port        = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var host        = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var mongoUrl    = 'mongodb://localhost:27017/sw';
var MongoClient = require('mongodb').MongoClient;
var server      = new hapi.Server();

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  mongoUrl = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_PORT + '/' + process.env.OPENSHIFT_APP_NAME;
}

var findDocuments = function(db, callback) {
  var collection = db.collection('films');
  collection.find({}, {_id: 0}).toArray(function(err, docs) {
    callback(docs);
  });
}

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

var findOneActor = function(db, lname, callback) {
  var lname = String(lname);
  var collection = db.collection('actors');
  //db.actors.find({'name': { '$regex': 'hamill', $options: 'i'}});
  collection.findOne({'name': { '$regex': lname, $options: 'i' }}, {_id: 0}, function(err, doc) {
    callback(doc);
  });

}

server.connection({ port: port, host: host });

server.route({
  path: '/',
  method: 'GET',
  config: {
    handler: rootHandler
  }
});

server.route({
  path: '/films',
  method: 'GET',
  config: {
    handler: filmsHandler
  }
});

server.route({
  path: '/films/{episodeno}',
  method: 'GET',
  config: {
    handler: filmHandler,
    validate: {
      params: {
        episodeno: joi.number().max(1)
      }
    }
  }
});

server.route({
  path: '/actors/{lname}',
  method: 'GET',
  config: {
    handler: actorHandler,
    validate: {
      params: {
        lname: joi.string().min(1).max(25)
      }
    }
  }
});

function rootHandler(request, response) {
  response('please chose an endpoint: /films or /actors');
}

function filmsHandler(request, response) {
  // mongo connection
  var url = mongoUrl;
  MongoClient.connect(url, function(err, db) {
    findDocuments(db, function(docs) {
      response(docs);
      db.close();
    });
  });
}

function filmHandler(request, response) {
  var episodeNo = request.params.episodeno;
  var url = mongoUrl;
  MongoClient.connect(url, function(err, db) {
    findOne(db, episodeNo, function(doc) {
      response(doc);
      db.close();
    })
  });
}

function actorHandler(request, response) {
  var lname = request.params.lname;
  var url = mongoUrl;
  MongoClient.connect(url, function(err, db) {
    findOneActor(db, lname, function(doc) {
      response(doc);
      db.close();
    })
  });
}

server.start(function () {
  console.log('As always, the magic happens on port ' + port);
});
