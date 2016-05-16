'use strict';

const Boom = require('boom');
const util = require('util');

exports.getAll = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesCategoryModel = request.models.NotesCategory;

  NoteModel
    .findAll({
      include: [{
        model: NotesCategoryModel,
        // used to remove the attributes of the join table otherwise
        // they are eagerly loaded in the NotesCategory object
        through: { attributes: [] }
      }]
    })
    .then(notes => reply(notes))
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred during Notes retrieve'));
    });
};

exports.getById = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesCategoryModel = request.models.NotesCategory;
  const noteId = request.params.id;

  NoteModel
    .findOne({
      where: {
        id: noteId
      },
      include: [{
        model: NotesCategoryModel,
        // used to remove the attributes of the join table otherwise
        // they are eagerly loaded in the NotesCategory object
        through: { attributes: [] }
      }]
    })
    .then(note => {
      if (!note) {
        return reply(Boom.notFound(`Note ${noteId} does not exist`));
      }

      reply(note);
    })
    .catch(err => reply(err));
};

exports.create = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesCategoryModel = request.models.NotesCategory;
  const payload = request.payload;

  NoteModel
    .create(payload)
    .then(newNote => {
      if (payload.NotesCategories && payload.NotesCategories.length > 0) {
        const catIds = payload.NotesCategories.map(cat => cat.id);
        return NotesCategoryModel
          .findAll({
            where: {
              id: {
                $in: catIds
              }
            }
          })
          .then(cat => {
            if (!cat || cat.length === 0) {
              throw Boom.notFound('Cannot link to inexsting categories');
            }
            return newNote.addNotesCategories(cat);
          })
          .then(() => {
            return NoteModel.find({
              where: {
                id: newNote.id
              },
              include: {
                model: NotesCategoryModel,
                through: { attributes: [] }
              }
            });
          });
      }

      return newNote;
    })
    .then(newNoteWithAssociations => reply(newNoteWithAssociations))
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred when creating new Note'));
    });
};

exports.update = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesCategoryModel = request.models.NotesCategory;
  const noteId = request.params.id;
  const payload = request.payload;

  NoteModel
    .findOne({
      where: {
        id: noteId
      },
      include: [{
        model: NotesCategoryModel,
        through: { attributes: [] }
      }]
    })
    .then(note => {
      if (!note) {
        throw Boom.notFound(`Note ${noteId} does not exist`);
      }

      if (payload.NotesCategories) {
        const catIds = payload.NotesCategories.map(cat => cat.id);
        return NotesCategoryModel
          .findAll({
            where: {
              id: {
                $in: catIds
              }
            }
          })
          .then(categories => {
            return note.setNotesCategories(categories);
          })
          .then(() => note.update(payload));
      }

      return note.update(payload);
    })
    .then(updatedNote => {
      return NoteModel
        .findOne({
          where: {
            id: updatedNote.id
          },
          include: [{
            model: NotesCategoryModel,
            through: { attributes: [] }
          }]
        });
    })
    .then(noteFromDb => reply(noteFromDb))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred while updating Note ${noteId}`));
    });
};

exports.delete = (request, reply) => {
  const NoteModel = request.models.Note;
  const noteId = request.params.id;

  NoteModel
    .findById(noteId)
    .then(note => {
      if (!note) {
        return reply(Boom.notFound(`Note ${noteId} does not exist`));
      }

      return note.destroy();
    })
    .then(() => reply().code(204))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when deleting note ${noteId}`));
    });
};

exports.getByCategory = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesCategoryModel = request.models.NotesCategory;
  const catId = request.params.catId;

  NoteModel
    .findAll({
      include: [{
        model: NotesCategoryModel,
        where: { id: catId },
        // used to remove the attributes of the join table otherwise
        // they are eagerly loaded in the NotesCategory object
        through: { attributes: [] }
      }]
    })
    .then(notes => reply(notes))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when retrieving all notes for category ${catId}`));
    });
};
