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
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      tableName: 'Note',
      classMethods: {
        associate: function(db) {
          this.belongsToMany(db.NotesCategory, { through: 'NotesToCategories', foreignKey: 'noteId' });
        }
      }
    }
  );

  return Note;
};
