'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.Group, { as: 'Group', foreignKey: 'groupId'});
      Event.belongsTo(models.Venue, { as: 'Venue', foreignKey: 'venueId'});
      Event.hasMany(models.Image, { as: 'EventImages', foreignKey: 'imageableId', constraints: false, scope: {imageType: 'eventImage'}});
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    venueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Venues',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Start date must be a valid datetime'
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numAttending: {
      type: DataTypes.INTEGER
    },
    previewImage: {
      type: DataTypes.STRING
    },
    capacity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      everything: {
        include: [
          {
            association: 'Group',
          },
          {
            association: 'Venue'
          }
        ]
      }
    }
  });
  return Event;
};
