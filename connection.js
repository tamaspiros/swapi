'use strict';

var mongoUrl    = 'mongodb://localhost:27017/sw';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  mongoUrl = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME;
}
module.exports = {
  url: mongoUrl
}
