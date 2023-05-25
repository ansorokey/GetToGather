'use strict';

const { Group, Venue } = require('../models');

const data = [
  {
    address: '42 wallaby way',
    city: 'Sydney',
    state: 'ASuzzieland',
    lat: 87.87,
    lng:-57.97
  },
  {
    address: '1 White House Drive',
    city: 'DC',
    state: 'Washington',
    lat: 32.28,
    lng: 92.56
  },
  {
    address: 'Some building I dunno',
    city: 'NowhereVille',
    state: 'Boonies',
    lat: 34.34,
    lng: 179.179
  },
  {
    address: 'Water Slide World',
    city: 'Lake George',
    state: 'New York',
    lat: 34.182,
    lng: 32.148
  },
  {
    address: '1 Broken Dreams Boulevard',
    city: 'Green Dayton',
    state: 'Americanidiotland',
    lat: -75.75,
    lng: 103.301
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const group = await Group.findByPk(1);
    for(let i = 0; i < data.length; i++ ){
      await group.createVenue(data[i]);
    }
  },

  async down (queryInterface, Sequelize) {
    for(let i = 0; i < 5; i++ ){
      await Venue.destroy({
        where: data[i]
      });
    }
  }
};
