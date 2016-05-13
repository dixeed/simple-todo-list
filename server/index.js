'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

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
      database: 'simple-todo',
      user: 'simple-todo',
      pass: 'simple-todo',
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,

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
  return db.sequelize.sync({force: true});
})
.then(() => server.start())
.then(() => console.log('Server listens on 8080'))
.catch((err) => {
  console.log('Server encountered an error:', err);
  process.exit(1);
});
