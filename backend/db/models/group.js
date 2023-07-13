'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {
        as: 'Organizer',
        foreignKey: 'organizerId'
      });
      Group.belongsToMany(models.User, {
        through: models.GroupMember,
        as: 'Members',
        foreignKey: 'groupId',
        otherKey: 'memberId'
      });
      Group.hasMany(models.Image, {foreignKey: 'imageableId', as: 'GroupImages', constraints: false, scope: {imageType: 'groupImage'}});
      Group.hasMany(models.Venue, { foreignKey: 'groupId' });
      Group.hasMany(models.Event, { foreignKey: 'groupId'});
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          msg: 'Name must be 60 characters or less'
        },
        notEmpty: {
          msg: 'Name must be 60 characters or less'
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [50, 255],
          msg: 'About must be between 50 and 255 characters'
        },
        notEmpty: {
          msg: 'About must be between 50 and 255 characters'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isBoolean(value) {
          if(value !== true && value !== false) throw new Error('Private must be a boolean');
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
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      venues: {
        include: [
          {
            association: 'Venues',
          },
        ]

      },
      memberScope: {
        include: {
          association: 'Members',
          attributes: [],
          through: {
            attributes: [],
            where: {
              status: ['member', 'co-host']
            }
          }
        },
        attributes: {
          include: [
            [
              sequelize.fn("COUNT", sequelize.col("Members.id")),
              "numMembers"
            ]
          ],
        },
        group: [sequelize.col('Group.id')]
        },
    }
  });
  return Group;
};
