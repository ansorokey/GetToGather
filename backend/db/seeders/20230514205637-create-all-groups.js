'use strict';

const { groups } = require('../../utils/generated-groups.js');
const { User, Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;

}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let organizer = await User.findOne({
      where: {
        firstName: 'Demo',
        lastName: 'User'
      }
    });
    for(let i = 1; i < 10; i++){
      await organizer.createOwnedGroup(groups[i]);
    }
  },

  async down (queryInterface, Sequelize) {
    const groupNames = groups.map(group => group.name);
    await Group.destroy({
      where: {
        name: groupNames
      }
    });

  }
};
