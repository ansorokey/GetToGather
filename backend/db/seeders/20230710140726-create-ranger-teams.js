'use strict';

const data = [
  {
    name: 'Power Rangers Dino Thunder',
    about: `Power Rangers' roar!

    There's a light in the distance
    See them coming closer!
    With the force of ages
    Centuries gone by!

    Protectors of the right,
    Defenders sworn to fight!

    Dino Rangers' roar!
    Power Rangers' score!
    Save us from these evil forces, win!
    (Power Rangers Dino Thunder!)
    Victory is ours forever more!

    Protectors of the right
    Defenders sworn to fight!
    (Power Rangers Dino Thunder!)

    Dino Rangers' roar!
    Power Rangers' score!
    Save us from these evil forces, win!
    (Power Rangers Dino Thunder!)`,
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

    Power Rangers Lightspeed Rescue!

    Light, Speed, go!


    Power's on its way,

    Rangers save the day!


    Power Rangers Lightspeed Rescue!

    Power Rangers Lightspeed Rescue!

    Power Rangers Lightspeed Rescue!

    Power Rangers Lightspeed Rescue!

    Light, Speed, Go!`,
    type: 'In person',
    private: true,
    city: 'Mariner Bay',
    state: 'California',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/c/c0/Power_Rangers_Lightspeed_Rescue_logo.png/revision/latest?cb=20201211051348',
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
    Their force is getting strong!
    They'll have to brave the weather!
    Ninja Storm! stand together!
    The storm will grow!
    Waters flow!
    Power Ranger Ninjas Go!
    Power Rangers Ninja Storm is growing (growing)
    is growing (growing)
    is GROWING! (GROWING!)
    Go!
    Power Rangers Go
    Ninja Storm!
    Let's Go!
    With the speed of the wind!
    Go!
    And strength like thunder!
    Go!
    Power Rangers Go
    Ninja Storm!
    Let's Go!`,
    type: 'In person',
    private: true,
    city: 'Blue Bay Harbor',
    state: 'New Jersey',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/9/9f/Power_Rangers_Ninja_Storm_logo.png/revision/latest?cb=20201211045603',
    username: 'senseiwatanabe'

  },
  {
    name: 'Power Rangers RPM',
    about: `A computer virus has built armies of robotic soldiers
    and taken control of our world.
    But there is still one place where we can be safe:
    The domed city of Corinth.
    And the only hope we have left is...

    (sung)

    Power Rangers RPM! Get in gear!
    Power Rangers RPM! We stand together!
    Power Rangers RPM! Get in gear!
    Power Rangers RPM! Get in gear!

    Power Rangers RPM! We stand together!
    Power Rangers RPM! Get in gear!
    Power Rangers RPM! Get in gear!`,
    type: 'In person',
    private: true,
    city: 'Corinth',
    state: 'New York',
    previewImage: 'https://static.wikia.nocookie.net/powerrangers/images/5/51/Power_Rangers_RPM_logo.png',
    username: 'doctork'

  },
  {
    name: 'Power Rangers SPD',
    about: ``,
    type: 'In person',
    private: true,
    city: '',
    state: '',
    previewImage: '',

  },
  {
    name: 'Power Rangers Time Force',
    about: ``,
    type: 'In person',
    private: true,
    city: '',
    state: '',
    previewImage: '',

  },
  {
    name: 'Power Rangers Wild Force',
    about: ``,
    type: 'In person',
    private: true,
    city: '',
    state: '',
    previewImage: '',

  }
]

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Groups';

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
   await queryInterface.bulkInsert(options, );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
