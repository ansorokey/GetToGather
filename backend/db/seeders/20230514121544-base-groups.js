'use strict';

const { User, Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const data = [
  {
    username: 'princessshayla',
    group: {
      name: 'Power Rangers Wild Force',
      about: 'Power Rangers Wild Force is a television series and the tenth season of Power Rangers.',
      type: 'In person',
      private: true,
      city: 'Turtle Cove',
      state: 'California'
    }
  },
  {
    username: 'lorddeath',
    group: {
      name: 'Death Weapon Meister Academy',
      about: 'Soul Eater is a Japanese manga series written and illustrated by Atsushi Ohkubo.',
      type: 'In person',
      private: false,
      city: 'Death City',
      state: 'Florida'
    }
  },
  {
    username: 'giddeongraves',
    group: {
      name: 'League Of Evil Exes',
      about: 'Scott Pilgrim vs. the World is a 2010 romantic action comedy film co-written, produced, and directed by Edgar Wright, based on the graphic novel series Scott Pilgrim by Bryan Lee O\'Malley.',
      type: 'In person',
      private: true,
      city: 'Toronto',
      state: 'Canada'
    }
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let i = 0; i < data.length; i++){
      const { username, group } = data[i];
      const user = await User.findOne({
        where: {
          username
        }
      });

      await user.createGroup({
        ...group
      });
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const groupNames = data.map(el => el.group.name);

    await queryInterface.bulkDelete(options, {
      name: groupNames
      // name: {
      //   [Op.in]: groupNames
      // }
    });
  }
};
