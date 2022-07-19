'use strict';
const { Model } = require('sequelize');
// const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" is required',
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Author" is required',
          },
        },
      },
      genre: DataTypes.STRING,
      year: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
