'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Group, {
        as: 'ownedGroup',
        foreignKey: 'organizerId'
      });
      User.belongsToMany(models.Group, {
        as: 'memberships',
        through: models.GroupMember,
        foreignKey: 'memberId',
        otherKey: 'groupId'
      });
      User.belongsToMany(models.Event, {
        through: models.EventAttendees,
        as: 'attending',
        foreignKey: 'userId',
        otherKey: 'eventId'
      });
      User.hasMany(models.EventAttendees, {foreignKey: 'userId', as: 'Attendance'});
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Username cannot be an email');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true,
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['email', 'hashedPassword', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};
