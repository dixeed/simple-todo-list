'use strict';

const handlers = require('./handlers');

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/notes',
    handler: handlers.getAll
  });

  server.route({
    method: 'GET',
    path: '/notes/{id}',
    handler: handlers.getById
  });

  server.route({
    method: 'POST',
    path: '/notes',
    handler: handlers.create
  });

  server.route({
    method: 'PUT',
    path: '/notes/{id}',
    handler: handlers.update
  });

  next();
};

exports.register.attributes = {
  name: 'note-plugin',
  version: '1.0'
};
