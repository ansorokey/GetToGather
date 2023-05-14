'use strict';

const bcrypt = require('bcryptjs');

const { User, Group, GroupMember } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

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
  },
  {
    groupName: 'Death Weapon Meister Academy',
    members: [
      {
        email: 'soulevans@email.com',
        username: 'soulevans',
        hashedPassword: bcrypt.hashSync('soulevans'),
        firstName: 'Soul',
        lastName: 'Evans'
      },
      {
        email: 'makaalbarn@email.com',
        username: 'makaalbarn',
        hashedPassword: bcrypt.hashSync('makaalbarn'),
        firstName: 'Maka',
        lastName: 'Albarn'
      },
      {
        email: 'blackstar@email.com',
        username: 'blackstar',
        hashedPassword: bcrypt.hashSync('blackstar'),
        firstName: 'Black',
        lastName: 'Star'
      },
      {
        email: 'tsubakinakatsukasa@email.com',
        username: 'tsubakinakatsukasa',
        hashedPassword: bcrypt.hashSync('tsubakinakatsukasa'),
        firstName: 'Tsubaki',
        lastName: 'Nakatsukasa'
      },
      {
        email: 'deaththekid@email.com',
        username: 'deaththekid',
        hashedPassword: bcrypt.hashSync('deaththekid'),
        firstName: 'Death',
        lastName: 'The Kid'
      },
      {
        email: 'elizabeththompson@email.com',
        username: 'elizabeththompson',
        hashedPassword: bcrypt.hashSync('elizabeththompson'),
        firstName: 'Elizabeth',
        lastName: 'Thompson'
      },
      {
        email: 'patriciathompson@email.com',
        username: 'patriciathompson',
        hashedPassword: bcrypt.hashSync('patriciathompson'),
        firstName: 'Patricia',
        lastName: 'Thompson'
      }
    ]
  },
  {
    groupName: 'League Of Evil Exes',
    members: [
      {
        email: 'matthewpatel@email.com',
        username: 'matthewpatel',
        hashedPassword: bcrypt.hashSync('matthewpatel'),
        firstName: 'Matthew',
        lastName: 'Patel'
      },
      {
        email: 'lucasless@email.com',
        username: 'lucasless',
        hashedPassword: bcrypt.hashSync('lucasless'),
        firstName: 'Lucas',
        lastName: 'Lee'
      },
      {
        email: 'toddingram@email.com',
        username: 'toddingram',
        hashedPassword: bcrypt.hashSync('toddingram'),
        firstName: 'Todd',
        lastName: 'Ingram'
      },
      {
        email: 'roxierichter@email.com',
        username: 'roxierichter',
        hashedPassword: bcrypt.hashSync('roxierichter'),
        firstName: 'Roxie',
        lastName: 'Richter'
      },
      {
        email: 'kylekatayanagi@email.com',
        username: 'kylekatayanagi',
        hashedPassword: bcrypt.hashSync('kylekatayanagi'),
        firstName: 'Kyle',
        lastName: 'Katayanagi'
      },
      {
        email: 'kenkatayanagi@email.com',
        username: 'kenkatayanagi',
        hashedPassword: bcrypt.hashSync('kenkatayanagi'),
        firstName: 'Ken',
        lastName: 'Katayanagi'
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
        const member = await User.create(members[j]);
        await GroupMember.create({
          groupId: group.id,
          memberId: member.id
        })
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';

    for(let i = 0; i < data.length; i++){
      const { members } = data[i];

      for(let j = 0; j < members.length; j++){
        const member = await User.findOne({
          where: {
            username: members[j].username
          }
        });

        if(member) await member.destroy();
      }
    }
  }
};
