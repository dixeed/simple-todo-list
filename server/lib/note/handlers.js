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
  const NotesToCategoriesModel = request.models.NotesToCategories;
  const NotesCategoryModel = request.models.NotesCategory;
  const payload = request.payload;

  NoteModel
    .create(payload)
    .then(newNote => {
      if (payload.notesCategory) {
        const notesToCategoriesItems = payload.notesCategory.map(cat => {
          return { notesCategoryId: cat.id, noteId: newNote.id };
        });

        return NotesToCategoriesModel
          .bulkCreate(notesToCategoriesItems)
          .then(() => {
            const categoriesId = notesToCategoriesItems.map(cat => cat.notesCategoryId);
            return NotesCategoryModel
              .findAll({
                where: {
                  id: {
                    $in: categoriesId
                  }
                }
              })
              .then(categories => {
                newNote.dataValues.notesCategory = categories;
                reply(newNote);
              });
          });
      }

      return reply(newNote);
    })
    .catch(err => {
      console.log(err);
      reply(Boom.wrap(err, 500, 'Error occurred when creating new Note'));
    });
};

exports.update = (request, reply) => {
  const NoteModel = request.models.Note;
  const NoteToCategoriesModel = request.models.NoteToCategories;
  const noteId = request.params.id;
  const payload = request.payload;

  NoteModel
    .findById(noteId)
    .then(note => {
      if (!note) {
        return reply(Boom.notFound(`Note ${noteId} does not exist`));
      }

      const catId = payload.notesCategory.map(cat => cat.id);
      return NoteToCategoriesModel
        .update(
          {
            notesCategoryId: {
              $in: catId
            }
          },
          {
            where: { noteId: note.id }
          }
        )
        .spread(function(affectedCount, affectedRows) {
          console.log(affectedCount);
        })
        .then(() => {
          return note.update(payload);
        });
    })
    .then(() => reply().code(204))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when updating note ${noteId}`));
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
        where: { id: catId }
      }]
    })
    .then(notes => reply(notes))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when retrieving all notes for category ${catId}`));
    });
};
