'use strict';

const Boom = require('boom');
const util = require('util');

exports.getAll = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesToCategoriesModel = request.models.NotesToCategories;
  const NotesCategoryModel = request.models.NotesCategory;

  NoteModel
    .findAll()
    .then(notes => {
      const notesId = notes.map(note => note.id);
      return NotesToCategoriesModel
        .findAll({
          where: {
            noteId: {
              $in: notesId
            }
          }
        })
        .then(notesToCat => {
          const categoriesId = notesToCat.map(noteToCat => noteToCat.notesCategoryId);
          return NotesCategoryModel
            .findAll({
              where: {
                id: {
                  $in: categoriesId
                }
              }
            })
            .then(categories => {
              notes.forEach(note => {
                const catLinkedToNotes = notesToCat.filter(noteToCat => {
                  return noteToCat.noteId === note.id;
                });

                const catsLinked = categories.filter(cat => {
                  return catLinkedToNotes.some(cltn => {
                    return cltn.notesCategoryId === cat.id;
                  });
                });

                note.dataValues.notesCategory = catsLinked;
              });

              reply(notes);
            });
        });
    })
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred during Notes retrieve'));
    });
};

exports.getById = (request, reply) => {
  const NoteModel = request.models.Note;
  const NotesToCategoriesModel = request.models.NotesToCategories;
  const NotesCategoryModel = request.models.NotesCategory;
  const noteId = request.params.id;

  NoteModel
    .findById(noteId)
    .then(note => {
      if (!note) {
        return reply(Boom.notFound(`Note ${noteId} does not exist`));
      }

      return NotesToCategoriesModel
        .findAll({
          where: {
            noteId: noteId
          }
        })
        .then(notesToCat => {
          const categoriesId = notesToCat.map(noteToCat => noteToCat.notesCategoryId);
          return NotesCategoryModel
            .findAll({
              where: {
                id: {
                  $in: categoriesId
                }
              }
            })
            .then(categories => {
              note.dataValues.notesCategory = categories;
              reply(note);
            });
        });
    })
    .catch(err => {
      console.log(err);
      reply(Boom.wrap(err, 500, `Error occurred : cannot get note ${noteId}`));
    });
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
  const noteId = request.params.id;
  const payload = request.payload;

  NoteModel
    .findById(noteId)
    .then(note => {
      if (!note) {
        return reply(Boom.notFound(`Note ${noteId} does not exist`));
      }

      return note.update(payload);
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
  const NotesToCategoriesModel = request.models.NotesToCategories;
  const catId = request.params.catId;

  NotesToCategoriesModel
    .findAll({
      where: {
        notesCategoryId: catId
      }
    })
    .then(notesToCat => {
      const notesId = notesToCat.map(noteToCat => noteToCat.noteId);

      return NoteModel
        .findAll({
          where: {
            id: {
              $in: notesId
            }
          }
        });
    })
    .then(notes => {
      if (!notes || notes.length === 0) {
        return reply(Boom.notFound(`No notes for category ${catId}`));
      }
      reply(notes);
    })
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when retrieving all notes for category ${catId}`));
    });
};
