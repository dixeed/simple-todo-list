'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require('./config');

server.connection({
  host: 'localhost',
  port: 8080,
  routes: {
    cors: true,
  }
});

server.register([
  {
    register: require('hapi-sequelize'),
    options: {
      database: config.get('/database/name'),
      user: config.get('/database/user'),
      pass: config.get('/database/pass'),
      dialect: config.get('/database/dialect'),
      host: config.get('/database/host'),
      port: config.get('/database/port'),

      models: 'lib/**/model.js',
      logging: false
    }
  },
  require('./extension/database'),
  require('./lib/note'),
  require('./lib/note-category')
])
.then(() => {
  console.log('Plugins loaded');

  let db = server.plugins['hapi-sequelize'].db;
  return db.sequelize.sync({force: false});
})
.then(() => server.start())
.then(() => console.log('Server listens on 8080'))
.catch((err) => {
  console.log('Server encountered an error:', err);
  process.exit(1);
});
