'use strict';

const Boom = require('boom');

exports.getAll = (request, reply) => {
  const NoteModel = request.models.Note;

  NoteModel
    .findAll()
    .then(notes => reply(notes))
    .catch(err => {
      return reply(Boom.wrap(err, 'An error occurred during Notes retrieve'));
    });
};

exports.getById = (request, reply) => {
  const NoteModel = request.models.Note;
  const noteId = request.params.id;

  NoteModel
    .findById(noteId)
    .then(note => {
      if (!note) {
        return reply(Boom.notFound(`Note ${noteId} does not exist`));
      }
      reply(note);
    })
    .catch(err => {
      reply(Boom.wrap(err, `An error occurred : cannot get note ${noteId}`));
    });
};
