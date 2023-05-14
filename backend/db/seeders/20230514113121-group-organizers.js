'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const users = [
  {
    email: 'princessshayla@email.com',
    username: 'princessshayla',
    hashedPassword: bcrypt.hashSync('princessshayla'),
    firstName: 'Princess',
    lastName: 'Shayla'
  },
  {
    email: 'lorddeath@email.com',
    username: 'lorddeath',
    hashedPassword: bcrypt.hashSync('lorddeath'),
    firstName: 'Lord',
    lastName: 'Death'
  },
  {
    email: 'giddeongraves@email.com',
    username: 'giddeongraves',
    hashedPassword: bcrypt.hashSync('giddeongraves'),
    firstName: 'Giddeon',
    lastName: 'Graves'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users'
    await queryInterface.bulkInsert(options, users);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const usernames = users.map(user => user.username);
    await queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: usernames
      }
    });
  }
};
