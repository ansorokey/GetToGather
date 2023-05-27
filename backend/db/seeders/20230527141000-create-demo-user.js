'use strict';
const bcrypt = require('bcryptjs');

const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.create({
      firstName: 'Demo',
      lastName: 'User',
      username: 'demouser',
      email: 'demouser@email.com',
      hashedPassword: bcrypt.hashSync('password')
    })
  },

  async down (queryInterface, Sequelize) {
    await User.destroy({
      where: {
        username: 'demouser'
      }
    })
  }
};
