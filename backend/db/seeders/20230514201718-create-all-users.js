'use strict';
const bcrypt = require('bcryptjs');
const { users } = require('../../utils/generated-users.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

users.forEach(user => user.hashedPassword = bcrypt.hashSync(user.username));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, users);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';

    const usernames = users.map(user => user.username);
    await queryInterface.bulkDelete(options, {
      username: usernames
    });
  }
};
