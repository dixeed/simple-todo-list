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

  server.route({
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handlers.delete
  });

  server.route({
    method: 'GET',
    path: '/notes/category/{catId}',
    handler: handlers.getByCategory
  });

  next();
};

exports.register.attributes = {
  name: 'note-plugin',
  version: '1.0'
};
