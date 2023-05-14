'use strict';

const bcrypt = require('bcryptjs');

const { User, Group } = require('../models');

const data = [
  {
    groupName: 'Power Rangers Wild Force',
    members: [
      {
        email: 'colevans@email.com',
        username: 'redRanger',
        hashedPassword: bcrypt.hashSync('redRanger'),
        firstName: 'Cole',
        lastName: 'Evans'
      },
      {
        email: 'tayloreardhart@email.com',
        username: 'yellowRanger',
        hashedPassword: bcrypt.hashSync('yellowRanger'),
        firstName: 'Taylor',
        lastName: 'Earhardt'
      },
      {
        email: 'maxcooper@email.com',
        username: 'blueRanger',
        hashedPassword: bcrypt.hashSync('blueRanger'),
        firstName: 'Max',
        lastName: 'Cooper'
      },
      {
        email: 'dannydelgado@email.com',
        username: 'blackRanger',
        hashedPassword: bcrypt.hashSync('blackRanger'),
        firstName: 'Danny',
        lastName: 'Delgado'
      },
      {
        email: 'alyssaenrile@email.com',
        username: 'whiteRanger',
        hashedPassword: bcrypt.hashSync('whiteRanger'),
        firstName: 'Alyssa',
        lastName: 'Enrile'
      },
      {
        email: 'merrickbaliton@email.com',
        username: 'wolfRanger',
        hashedPassword: bcrypt.hashSync('wolfRanger'),
        firstName: 'Merrick',
        lastName: 'Baliton'
      }
    ]
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for(let i = 0; i < data.length; i++){
      const { groupName, members } = data[i];
      const group = await Group.findOne({
        where: {
          name: groupName
        }
      });

      for(let j = 0; j < members.length; j++){
        const member = await User.create(members[i]);
        await group.add(member);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    for(let i = 0; i < data.length; i++){
      const { groupName, members } = data[i];
      const group = await Group.findOne({
        where: {
          name: groupName
        }
      });

      for(let j = 0; j < members.length; j++){
        const member = await User.create(members[i]);
        await group.remove(member);
      }
    }
  }
};
