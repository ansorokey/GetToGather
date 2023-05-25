'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventAttendees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EventAttendees.belongsTo(models.Event, { foreignKey: 'eventId'} );
      EventAttendees.belongsTo(models.User, { foreignKey: 'userId'} );
    }
  }
  EventAttendees.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['attending', 'waitlist', 'pending']]
      }
    }
  }, {
    sequelize,
    modelName: 'EventAttendees',
  });
  return EventAttendees;
};
