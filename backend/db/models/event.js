'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      Event.belongsTo(models.Group, { foreignKey: 'groupId'});
      Event.belongsTo(models.Venue, { as: 'Venue', foreignKey: 'venueId'});
      Event.hasMany(models.Image, { as: 'EventImages', foreignKey: 'imageableId', constraints: false, scope: {imageType: 'eventImage'}});
      Event.hasMany(models.EventAttendee, { foreignKey: 'eventId', as: 'attendingCount'})
      Event.belongsToMany(models.User, {
        through: models.EventAttendee,
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
        notNull: {
          msg: 'Name must be at least 5 characters'
        },
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
        },
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Type must be Onlione or In person'
        },
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
        // isBefore: {
        //   args: [(this.endDate)],
        //   msg: 'End date is less than start date'
        // },
        isAfter: {
          args: [Date()],
          msg: 'End date is less than start date'
        },
        notNull: {
          msg: 'Start date must be a valid datetime'
        },
        isDate: {
          msg: 'Start date must be a valid datetime'
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: [this.startDate],
          msg: 'End date is less than start date'
        },
        notNull: {
          msg: 'End date must be a valid datetime'
        },
        isDate: {
          msg: 'End date must be a valid datetime'
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
        notNull: {
          msg: 'Capacity must be an integer'
        },
        isInt: {
          msg: 'Capacity must be an integer'
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price is invalid'
        },
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
    scopes: {
      allMembers: {
        include: [
          {
            association: 'Attendance',
            attributes: [],
            through: {
              attributes: [],
              where: { status: 'attending' }
            }
          },
          {
            association: 'Group',
            attributes: ['id', 'name', 'city', 'state']
          },
          {
            association: 'Venue',
            attributes: ['id', 'city', 'state']
          }
        ],
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('Attendance.id')), 'numAttending']],
          exclude: ['createdAt', 'updatedAt']
        }
      },
    }
  });
  return Event;
};
