'use strict';

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const demoUsers = [
  {
    email: 'demoemail1@email.com',
    username: 'demouser1',
    hashedPassword: bcrypt.hashSync('1password1'),
    firstName: 'first1',
    lastName: 'last1'
  },
  {
    email: 'demoemail2@email.com',
    username: 'demouser2',
    hashedPassword: bcrypt.hashSync('2password2'),
    firstName: 'first2',
    lastName: 'last2'
  },
  {
    email: 'demoemail3@email.com',
    username: 'demouser3',
    hashedPassword: bcrypt.hashSync('3password3'),
    firstName: 'first3',
    lastName: 'last3'
  },
  {
    email: 'demoemail4@email.com',
    username: 'demouser4',
    hashedPassword: bcrypt.hashSync('4password4'),
    firstName: 'first4',
    lastName: 'last4'
  },
  {
    email: 'demoemail5@email.com',
    username: 'demouser5',
    hashedPassword: bcrypt.hashSync('5password5'),
    firstName: 'first5',
    lastName: 'last5'
  },
  {
    email: 'demoemail6@email.com',
    username: 'demouser6',
    hashedPassword: bcrypt.hashSync('6password6'),
    firstName: 'first6',
    lastName: 'last6'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return await queryInterface.bulkInsert(options, demoUsers);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';

    const usernames = demoUsers.map(user => user.username);
    return await queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: usernames
      }
    });
  }
};
