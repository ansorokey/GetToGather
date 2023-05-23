'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg:'Street address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State is required'
        }
      }
    },
    lat: {
      type: DataTypes.FLOAT(8, 6),
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'Latitude is not valid'
        },
        min: {
          args: [-90.000000],
          msg: 'Latitude is not valid'
        },
        max: {
          args: [90.000000],
          msg: 'Latitude is not valid'
        }
      }
    },
    lng: {
      type: DataTypes.FLOAT(9, 6),
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'Longitude is not valid'
        },
        min: {
          args: [-180.000000],
          msg: 'Longitude is not valid'
        },
        max: {
          args: [180.000000],
          msg: 'Longitude is not valid'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Venue;
};
