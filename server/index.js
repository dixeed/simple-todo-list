'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8080
});

server.register([
  {
    register: require('hapi-sequelize'),
    options: {
      database: 'simple-todo',
      user: 'simple-todo',
      pass: 'simple-todo',
      dialect: 'postgres',
      host: 'localhost',
      port: 5433,

      models: 'lib/**/models.js',
      logging: false
    }
  }
])
.then(function() {
  console.log('Plugins loaded');

  let db = server.plugins['hapi-sequelize'].db;
  return db.sequelize.sync({force: false});
})
.then(function() {
  return server.start();
})
.then(function() {
  console.log('Server listens on 8080');
})
.catch(function(err) {
  console.log('Server encountered an error:', err);
  process.exit(1);
});
