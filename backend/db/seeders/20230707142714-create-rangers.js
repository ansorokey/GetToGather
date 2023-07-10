'use strict';
const { allRangers } = require("../../utils");
const { Op } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   for(let i = 0; i < allRangers.length; i++){
    let members = allRangers[i];
    await queryInterface.bulkInsert(options, members);
   }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for(let i = 0; i < allRangers.length; i++){
      let members = allRangers[i];
      await queryInterface.bulkDelete(options, {
        email: {
          [Op.in]: members.map(user => user.email)
        }
      });
    }
  }
};
