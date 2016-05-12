'use strict';

const handlers = require('./handlers');

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/notes-categories',
    handler: handlers.getAll
  });

  server.route({
    method: 'GET',
    path: '/notes-categories/{id}',
    handler: handlers.getById
  });

  server.route({
    method: 'POST',
    path: '/notes-categories',
    handler: handlers.create
  });

  server.route({
    method: 'PUT',
    path: '/notes-categories/{id}',
    handler: handlers.update
  });

  server.route({
    method: 'DELETE',
    path: '/notes-categories/{id}',
    handler: handlers.delete
  });

  next();
};

exports.register.attributes = {
  name: 'note-category-plugin',
  version: '1.0'
};
