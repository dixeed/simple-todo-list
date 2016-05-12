'use strict';

exports.register = (server, options, next) => {
  server.ext({
    type: 'onPreHandler',
    method: (request, reply) => {
      request.models = server.plugins['hapi-sequelize'].db.sequelize.models;
      reply.continue();
    }
  });

  next();
};

exports.register.attributes = {
  name: 'database-request-extension',
  version: '1.0'
};
