'use strict';

module.exports = function(sequelize, DataTypes) {
  // id are generated automatically
  const Note = sequelize.define(
    'Note',
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'Note',
      classMethods: {
        associate: (db) => {
          Note.belongsToMany(db.NotesCategory, { through: 'NotesToCategories', foreignKey: 'noteId' });
        }
      }
    }
  );

  return Note;
};
