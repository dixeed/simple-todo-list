'use strict';

const Boom = require('boom');

exports.getAll = (request, reply) => {
  const NotesCategory = request.models.NotesCategory;

  NotesCategory
    .findAll()
    .then(cat => reply(cat))
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred during Notes categories retrieve'));
    });
};

exports.getById = (request, reply) => {
  const NotesCategory = request.models.NotesCategory;
  const catId = request.params.id;

  NotesCategory
    .findById(catId)
    .then(cat => {
      if (!cat) {
        return reply(Boom.notFound(`Note category ${catId} does not exist`));
      }
      reply(cat);
    })
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred : cannot get note category ${catId}`));
    });
};

exports.create = (request, reply) => {
  const NotesCategory = request.models.NotesCategory;
  const payload = request.payload;

  NotesCategory
    .create(payload)
    .then(newCat => reply(newCat))
    .catch(err => {
      reply(Boom.wrap(err, 500, 'Error occurred when creating new Note Category'));
    });
};

exports.update = (request, reply) => {
  const NotesCategory = request.models.NotesCategory;
  const catId = request.params.id;
  const payload = request.payload;

  NotesCategory
    .findById(catId)
    .then(cat => {
      if (!cat) {
        return reply(Boom.notFound(`Note category ${catId} does not exist`));
      }

      return cat.update(payload);
    })
    .then(() => reply().code(204))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when updating note category ${catId}`));
    });
};

exports.delete = (request, reply) => {
  const NotesCategory = request.models.NotesCategory;
  const catId = request.params.id;

  NotesCategory
    .findById(catId)
    .then(cat => {
      if (!cat) {
        return reply(Boom.notFound(`Note category ${catId} does not exist`));
      }

      return cat.destroy();
    })
    .then(() => reply().code(204))
    .catch(err => {
      reply(Boom.wrap(err, 500, `Error occurred when deleting note category ${catId}`));
    });
};
