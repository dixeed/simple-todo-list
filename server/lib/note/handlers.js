'use strict';

const Boom = require('boom');

exports.getAll = (request, reply) => {
  const NoteModel = request.models.Note;

  NoteModel
    .findAll()
    .then(notes => reply(notes))
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred during Notes retrieve'));
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
      reply(Boom.wrap(err, 500, `Error occurred : cannot get note ${noteId}`));
    });
};

exports.create = (request, reply) => {
  const NoteModel = request.models.Note;
  const payload = request.payload;

  NoteModel
    .create(payload)
    .then(newNote => reply(newNote))
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred when creating new Note'));
    });
};
