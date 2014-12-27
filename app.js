'use strict';

var hapi   = require('hapi');

var port   = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var host   = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

var root   = require('./root');
var actors = require('./actors');
var films  = require('./films');

var server = new hapi.Server();

server.connection({host: host, port: port, routes: {cors: true}});

server.route({method: 'GET', path: '/', config: root.indexHandler});

server.route({method: 'GET', path: '/films', config: films.allFilmsHandler});
server.route({method: 'GET', path: '/films/{episodeno}', config: films.oneFilmHandler});

server.route({method: 'GET', path: '/actors/{lname}', config: actors.actorHandler});

server.start(function () {
  console.log('As always, the magic happens on port ' + port);
});
