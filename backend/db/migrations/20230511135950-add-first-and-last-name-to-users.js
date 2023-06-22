'use strict';

// When altering tables, similar options format to creating/dropping
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'Users';
// here we include the table name in the options
// options passed in as first arguement

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // exclude table name in interface, use options object instead
    await queryInterface.addColumn(options, 'firstName', Sequelize.STRING, {
      allowNull: false
    });

    await queryInterface.addColumn(options, 'lastName', Sequelize.STRING, {
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
  }
};
