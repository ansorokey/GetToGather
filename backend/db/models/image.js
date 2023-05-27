'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Group, {foreignKey: 'imageableId', constraints: false, hooks: true, onDelete: 'cascade'});
      Image.belongsTo(models.Event, {foreignKey: 'imageableId', constraints: false, hooks: true, onDelete: 'cascade'});
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Image requires a url'
        }
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Preview must be a boolean'
        },
        isIn: {
          args: [[true, false]],
          msg: 'Preview must be a boolean'
        }
      }
    },
    imageType: {
      type: DataTypes.STRING
    },
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope: {
      attributes: ['id', 'url', 'preview']
    }
  });
  return Image;
};
