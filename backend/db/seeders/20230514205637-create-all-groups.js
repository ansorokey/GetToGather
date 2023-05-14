'use strict';

const bcrypt = require('bcryptjs');
const { groups } = require('../../utils/generated-groups.js');
const { User, Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;

}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const fiveUsers = await User.findAll({
      limit: 10
    });
    for(let i = 0; i < fiveUsers.length; i++){
      let organizer = fiveUsers[i];
      await organizer.createOrganizer(groups[i]);
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
