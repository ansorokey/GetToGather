'use strict';
const bcrypt = require('bcryptjs');

const { User } = require('../models');

// if using queryInterface functions, apply the following code:
/*
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = '<TableName>';
*/
// options object will be passed in fas first arguement

// schema and table name do not need to be used on sequelize model methods
// the schema is already defined for those

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
