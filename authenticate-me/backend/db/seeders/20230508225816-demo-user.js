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
    username: 'demoUserIchi',
    hashedPassword: bcrypt.hashSync('1password1')
  },
  {
    email: 'demoemail2@email.com',
    username: 'UserTwoser',
    hashedPassword: bcrypt.hashSync('2password2')
  },
  {
    email: 'demoemail3@email.com',
    username: 'Number3LookAtMEEEE',
    hashedPassword: bcrypt.hashSync('3password3')
  },
  {
    email: 'demoemail4@email.com',
    username: 'QuatCat',
    hashedPassword: bcrypt.hashSync('4password4')
  },
  {
    email: 'demoemail5@email.com',
    username: 'Alive200&Five',
    hashedPassword: bcrypt.hashSync('5password5')
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
