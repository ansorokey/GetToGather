'use strict';

const { Group, Event } = require('../models');

const data = [
  {
    venueId: 1,
    name: 'fight safi\'jiva',
    description: 'Today is the day we take this alien dragon down, once and for all!',
    type: 'Online',
    capacity: 16,
    price: 0.00,
    startDate: '2024-11-19',
    endDate: '2024-11-20'
  },
  {
    venueId: 2,
    name: 'defeatFatalis',
    description: 'LOL we are going to get rekt over and over and over and over again',
    type: 'Online',
    capacity: 4,
    price: 0.00,
    startDate: '2027-10-10',
    endDate: '2027-12-12'
  },
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const group = await Group.findByPk(2);
    for(let i = 0; i < data.length; i++){
      await group.createEvent(data[i]);
    }
  },

  async down (queryInterface, Sequelize) {
    const group = await Group.findByPk(1);
    for(let i = 0; i < data.length; i++){
      await Event.destroy({
        where: data[i]
      })
    }
  }
};
