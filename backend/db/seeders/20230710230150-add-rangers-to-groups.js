'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'GroupMembers';

const { Op } = require('sequelize');
const { Group, User } = require('../models');
const { allRangers } = require('../../utils/index');
const rangerGroups = [
  'Power Rangers Dino Thunder',
  'Power Rangers Lightspeed Rescue',
  'Power Rangers Ninja Storm',
  'Power Rangers RPM',
  'Power Rangers SPD',
  'Power Rangers Time Force',
  'Power Rangers Wild Force',
]

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
      const usernames = allRangers[i].map(pr => pr.username);
      const teamName = rangerGroups[i];

      const group = await Group.findOne({
        where: {
          name: teamName
        }
      });

      let members = await User.findAll({
        where: {
          username: {
            [Op.in]: usernames
          }
        }
      })

      const data = members.map( m => {
        return {
          groupId: group.id,
          memberId: m.id,
          status: 'member'
        }
      });

      // await group.addMembers(members);
      await queryInterface.bulkInsert(options, data)


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
      const usernames = allRangers[i].map(pr => pr.username);
      const teamName = rangerGroups[i];

      const group = await Group.findOne({
        where: {
          name: teamName
        }
      });

      let members = await User.findAll({
        where: {
          username: {
            [Op.in]: usernames
          }
        }
      })

      const data = members.map( m => {
        return {
          groupId: group.id,
          memberId: m.id,
          status: 'member'
        }
      });

      // await group.addMembers(members);
      await queryInterface.bulkDelete(options, {
        groupId: group.id,
        memberId: {
          [Op.in]: members.map( m => m.id)
        }
      })


    }

  }
};
