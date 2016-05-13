'use strict';

module.exports = function(sequelize, DataTypes) {
  // id are generated automatically
  const NotesCategory = sequelize.define(
    'NotesCategory',
    {
      label: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      iconUrl: {
        type: DataTypes.STRING(250),
        allowNull: true
      }
    },
    {
      tableName: 'NotesCategory',
      classMethods: {
        associate: (db) => {
          NotesCategory.belongsToMany(db.Note, { through: 'NotesToCategories', foreignKey: 'notesCategoryId' });
        }
      }
    }
  );

  return NotesCategory;
};
