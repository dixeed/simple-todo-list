'use strict';

const handlers = require('./handlers');

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/notes',
    handler: handlers.getAll
  })
  next();
};

exports.register.attributes = {
  name: 'note-plugin',
  version: '1.0'
};
