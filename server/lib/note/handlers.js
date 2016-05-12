'use strict';

const Boom = require('boom');

exports.getAll = (request, reply) => {
  const NoteModel = request.models.Note;

  NoteModel
    .findAll()
    .then((notes) => reply(notes))
    .catch((err) => {
      return reply(Boom.wrap(err, 'An error occurred during Notes retrieve'));
    });
};
