'use strict';
const { User, Group } = require('../models');
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.findAll({
      where: {
        firstName: {
          [Op.not]: 'Demo'
        },
        lastName: {
          [Op.not]: 'User'
        }
      }
    });

    const groups = await Group.findAll();

    for(let i = 0; i < groups.length; i++){
      let g = groups[i];
      for(let j = i; j <= 50; j += 5){
        await g.addMember(users[j]);
      }
    }

  },

  async down (queryInterface, Sequelize) {
    const users = await User.findAll({
      where: {
        firstName: {
          [Op.not]: 'Demo'
        },
        lastName: {
          [Op.not]: 'User'
        }
      }
    });

    const groups = await Group.findAll();

    for(let i = 0; i < groups.length; i++){
      let g = groups[i];
      for(let j = i; j <= 50; j += 5){
        await g.removeMember(users[j]);
      }
    }
  }
};
