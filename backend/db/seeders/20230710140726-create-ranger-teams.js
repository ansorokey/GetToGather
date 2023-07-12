'use strict';
const { User } = require('../models');
const { Op } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Groups';

const data = [
  {
    name: 'Power Rangers Dino Thunder',
    about: `Power Rangers' roar! There's a light in the distance
    See them coming closer!
    With the force of ages
    Centuries gone by!
    Protectors of the right,
    Defenders sworn to fight!
    Dino Rangers' roar!
    Power Rangers' score!
    Save us from these evil forces, win!
    (Pow`,
    type: 'In person',
    private: true,
    city: 'Reefside',
    state: 'California',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/9/97/Power_Rangers_Dino_Thunder_S12_Logo.png',
    username: 'tommyoliver'
  },
  {
    name: 'Power Rangers Lightspeed Rescue',
    about: `Power Rangers Lightspeed!
    Lightspeed Rescue!
    The signal is calling,
    Our planet is falling;
    The danger will test you,
    Better make it a Lightspeed Rescue!
    Rangers, Go! Power Rangers!
    Power Rangers Lightspeed Rescue!
    Power Rangers Lightspeed Rescue!
    Power `,
    type: 'In person',
    private: true,
    city: 'Mariner Bay',
    state: 'California',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/c/c0/Power_Rangers_Lightspeed_Rescue_logo.png',
    username: 'captainmitchell'

  },
  {
    name: 'Power Rangers Ninja Storm',
    about: `Deep in the mountains, secret ninja academies trains our future protectors.
    Ancient scrolls told of three, who would be chosen above the others.
    Three who will become...
    Go!
    Power Rangers Go
    Ninja Storm!
    Let's Go!
    The call is on!
    Their force is getting `,
    type: 'In person',
    private: true,
    city: 'Blue Bay Harbor',
    state: 'New Jersey',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/9/9f/Power_Rangers_Ninja_Storm_logo.png',
    username: 'senseiwatanabe'

  },
  {
    name: 'Power Rangers RPM',
    about: `A computer virus has built armies of robotic soldiers
    and taken control of our world.
    But there is still one place where we can be safe:
    The domed city of Corinth.
    And the only hope we have left is...
    Power Rangers RPM! Get in gear!
    Power Rangers RPM! W`,
    type: 'In person',
    private: true,
    city: 'Corinth',
    state: 'New York',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/5/51/Power_Rangers_RPM_logo.png',
    username: 'doctork'

  },
  {
    name: 'Power Rangers SPD',
    about: `S.P.D. Emergency!
    Power Rangers S.P.D.
    Power Rangers to the rescue!
    (Go Go Go Go)
    Power Rangers S.P.D.
    Power Rangers to the rescue!
    (Go Go Go Go)
    Heroes on your side,
    Heroes for all time,
    Out to save the universe!
    No matter where you are,
    If it's near o`,
    type: 'In person',
    private: true,
    city: 'Chicago',
    state: 'Illinois',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/f/f0/Power_Rangers_SPD_S13_Logo_2005.png',
    username: 'anubiscruger'
  },
  {
    name: 'Power Rangers Time Force',
    about: `Time Force!
    Time Force!
    Power Rangers!
    Racing to another time
    Chrono Morphers are online
    Timeless wonders
    Fire and thunder
    Off to save the world!
    Go Go Time Force!
    Time, Time, Time for Power Rangers Time Force!
    Time, Time, Time for Power Rangers Time Fo`,
    type: 'In person',
    private: true,
    city: 'Millenium City',
    state: 'New York',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/f/f0/Power_Rangers_Time_Force_S9_logo.png',
    username: 'circuitowl'

  },
  {
    name: 'Power Rangers Wild Force',
    about: `(Wild! Wild Force!)
    (Wild Force Access!)
    Wild Force Power Rangers!
    We'll defend what's right forever
    Wild Force Power Rangers!
    We'll protect this world together
    (Wild Force)
    (Wild Force, Wild Force!)
    Power Rangers flying higher (Go!)
    Wild Force running `,
    type: 'In person',
    private: true,
    city: 'Turtle Cove',
    state: 'California',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/3/3c/Power_Rangers_Wild_Force_S10_Logo.png',
    username: 'princessshayla'
  }
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
   for( let i = 0; i < data.length; i++){
    const pr = data[i];
    const user = await User.findOne({
      where: {
        username: pr.username
      }
    });

    await user.createOwnedGroup({
      name: pr.name,
      about: pr.about.slice(0, 256),
      type: pr.type,
      private: pr.private,
      city: pr.city,
      state: pr.state,
      previewImage: pr.previewImage
    });
   }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const names = data.map(pr => pr.name);
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: names
      }
    });
  }
};
