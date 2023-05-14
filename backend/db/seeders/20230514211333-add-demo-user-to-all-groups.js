'use strict';

const { User, Group } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const demouser = await User.findOne({
      where: {
        username: 'demouser'
      }
    });

    const allGroups = await Group.findAll();

    for(let i = 1; i < allGroups.length; i++){
      let group = allGroups[i];
      await group.addMember(demouser);
    }
  },

  async down (queryInterface, Sequelize) {
    const demouser = await User.findOne({
      where: {
        username: 'demouser'
      }
    });

    const allGroups = Group.findAll();

    for(let i = 1; i < allGroups.length; i++){
      await Group.removeMember(demouser);
    }
  }
};
