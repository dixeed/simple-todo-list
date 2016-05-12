'use strict';

exports.register = (server, options, next) => {
  
  next();
};

exports.register.attributes = {
  name: 'note-plugin',
  version: '1.0'
};
