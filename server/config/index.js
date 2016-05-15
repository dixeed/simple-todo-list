'use strict';

const Confidence = require('confidence');
const dbCredentials = require('./db-credentials');
let store;
let criteria = {};

exports.get = (key) => {
  return store.get(key, criteria);
};

store = new Confidence.Store({
  database: {
    name: dbCredentials.database,
    user: dbCredentials.user,
    pass: dbCredentials.pass,
    dialect: dbCredentials.dialect,
    host: dbCredentials.host,
    port: dbCredentials.port
  }
});
