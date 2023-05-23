'use strict';
const bcrypt = require('bcryptjs');
const { users } = require('../../utils/generated-users.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'Users';

users.forEach(user => user.hashedPassword = bcrypt.hashSync(user.username));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, users);
  },

  async down (queryInterface, Sequelize) {
    const usernames = users.map(user => user.username);
    await queryInterface.bulkDelete(options, {
      username: usernames
    });
  }
};
