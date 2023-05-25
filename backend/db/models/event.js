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
      Event.belongsTo(models.Group, { foreignKey: 'groupId'});
      Event.belongsTo(models.Venue, { as: 'Venue', foreignKey: 'venueId'});
      Event.hasMany(models.Image, { as: 'EventImages', foreignKey: 'imageableId', constraints: false, scope: {imageType: 'eventImage'}});
      Event.belongsToMany(models.User, {
        through: models.EventAttendees,
        as: 'Attendance',
        foreignKey: 'eventId',
        otherKey: 'userId'
      });
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
      allowNull: false,
      validate: {
        len: {
          args: [5],
          msg: 'Name must be at least 5 characters'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['In person', 'Online']],
          msg: 'Type must be Online or In person'
        }
      }
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
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Start date must be a valid datetime'
        }
      }
    },
    previewImage: {
      type: DataTypes.STRING
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Capacity must be an integer'
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'Price is invalid'
        },
        min: {
          args: [0],
          msg: 'Price is invalid'
        }
      }
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
