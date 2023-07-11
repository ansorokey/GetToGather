'use strict';

const { Event, Group } = require('../models');
const { Op } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Events';

const data = [

  {
    group: 'Power Rangers Dino Thunder',
    events: [
      {
        name: "Archeology Excavation",
        type: "In person",
        capacity: 10,
        price: 0.00,
        description: "Bring a brush and a fear of velociraptor claws, cuz it's time to dusty. These bones aren't going to dig themselves up. Not yet. These girls aren't that clever yet.",
        startDate: "2023-07-11 01:00:00",
        endDate: "2023-07-11 23:00:00",
      },
      {
        name: "Brunch-iosaurus",
        type: "In person",
        capacity: 20,
        price: 9.99,
        description: "Not quite breakfast, not quite lunch. Perfectly deliucious. Drop on by the Stegasorus Steakhouse and socialize with fellow shaving cream conniseurs.",
        startDate: "2023-07-12 09:00:00",
        endDate: "2023-07-12 12:00:00",
      },
      {
        name: "Dino-DNA Presentation",
        type: "Online",
        capacity: 100,
        price: 1.99,
        description: "Come and see what a mosquito and a little bit of tree sap can do for science. Narrated By Jeff Goldblum.",
        startDate: "2023-08-23 15:00:00",
        endDate: "2023-08-23 16:00:00",
      },
    ]
  },
  {
    group: 'Power Rangers Lightspeed Rescue',
    events: [
      {
        name: "Fire Safety 101",
        type: "In person",
        capacity: 15,
        price: 0.00,
        description: "Before you stop, drop, and roll, how about we stop, think, and consider how we can prevent fire related accidents.",
        startDate: "2023-07-11 16:00:00",
        endDate: "2023-07-11 17:00:00",
      },
      {
        name: "CPR for Dummies, on Dummies",
        type: "In person",
        capacity: 30,
        price: 4.99,
        description: "Summer needs lifeguards, and lifeguards need training. Rouge Cross certification available upon completion.",
        startDate: "2023-07-25 10:00:00",
        endDate: "2023-07-25 12:00:00",
      }
    ]
  },
  {
    group: 'Power Rangers Ninja Storm',
    events: [
      {
        name: "Unlock Your Inner gates",
        type: "In person",
        capacity: 15,
        price: 20.00,
        description: "Chakra? Ninjutsu? Genjutsu? Who neds flashy tricks when you have muscle and will. Stop waiting and start leg weighting! Presented by Rock Lee.",
        startDate: "2023-10-27 10:00:00",
        endDate: "2024-10-27 10:00:00",
      },
      {
        name: "Laugh at Borutos",
        type: "Online",
        capacity: 100,
        price: 0.00,
        description: "iu don't care how flashy this show is, it is an insult to the 5 Kage Summit. To all things Ninja. Dattebayo.",
        startDate: "2023-08-13 10:00:00",
        endDate: "2023-08-13 19:00:00",
      },
      {
        name: "X-Games",
        type: "In person",
        capacity: 80,
        price: 10.00,
        description: "Skateboarding, surfing, and dirtbikes. We've got the skills to give you thrills. Watch our competitors ride like the wind!",
        startDate: "2023-07-11 07:00:00",
        endDate: "2023-07-11 19:00:00",
      }
    ]
  },
  {
    group: 'Power Rangers RPM',
    events: [
      {
        name: "Spandex Fashion Show",
        type: "Online",
        capacity: 75,
        price: 5.99,
        description: "Curated by the one and only Doctor K, a full display of all things shiny and multicolored spandex.",
        startDate: "2023-07-12 15:00:00",
        endDate: "2023-07-12 17:00:00",
      },
      {
        name: "Staying Safe on the Internet",
        type: "Online",
        capacity: 15,
        price: 7.99,
        description: "Terminators? HAL? GLaDOS? The enslavement of humanity stops with you! Learn how to keep your calculator from calculating your demise from experts in tech.",
        startDate: "2025-07-12 15:00:00",
        endDate: "2025-07-12 17:00:00",
      }
    ]
  },
  {
    group: 'Power Rangers SPD',
    events: [
      {
        name: "Patrol Car Ride-Along",
        type: "In person",
        capacity: 4,
        price: 0.00,
        description: "Join an active duty officer and see what it's like to be on the force for a day! *Ages 13 and under only*",
        startDate: "2023-07-15 08:00:00",
        endDate: "2023-07-15 12:00:00",
      },
      {
        name: "Arrest The Skeleton of Al Capone",
        type: "In person",
        capacity: 1,
        price: 0.00,
        description: "Yes, he may be dead, but he was sentenced to 23 consecuitive life sentences. An unbeating heart is no excuse for an early release.",
        startDate: "2023-10-31 10:00:00",
        endDate: "2023-10-31 13:00:00",
      }
    ]
  },
  {
    group: 'Power Rangers Time Force',
    events: [
      {
        name: "Meet Miguel O'hara",
        type: "In person",
        capacity: 13,
        price: 9.28,
        description: "Are you a fan of the future? Of Spider-people? Of vampires? We've got the meeting of a lifetime for you! *Not responsible for any glitching out of reality*",
        startDate: "2099-10-31 10:00:00",
        endDate: "2099-10-31 13:00:00",
      },
      {
        name: "Time Machine Hot Tub",
        type: "In person",
        capacity: 6,
        price: 200.00,
        description: "Not to be confused with Hot Tub Time Machine. Catering provided by the 4th Dimension.",
        startDate: "3421-01-21 19:00:00",
        endDate: "3421-01-21 21:00:00",
      },
      {
        name: "Rob Your Future Self",
        type: "In person",
        capacity: 1,
        price: 0.00,
        description: "Going back in time and changing the future is questionably wrong. Luckily, laws don't apply going forward. The success of tomorrow: TODAY!",
        startDate: "2043-07-11 10:00:00",
        endDate: "2043-07-11 11:00:00",
      }
    ]
  },
  {
    group: 'Power Rangers Wild Force',
    events: [
      {
        name: "Spirit Animal Spirit Week",
        type: "In person",
        capacity: 18,
        price: 12.99,
        description: "Don't just find your spirit animal: pet it. Feed it snacks. Watch it urinate on your neighbors flowers.",
        startDate: "2023-08-08 12:30:00",
        endDate: "2023-08-08 13:30:00",
      },
      {
        name: "Lie around with Lions",
        type: "In person",
        capacity: 18,
        price: 12.99,
        description: "The king of the jungle is often king of couch potatoes. Curl up into a ball and enjoy some Zebra Jerky with zero responsibility.",
        startDate: "2023-09-19 14:00:00",
        endDate: "2023-09-19 15:45:00",
      }
    ]
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
   for(let i = 0; i < data.length; i++){
    const group = await Group.findOne({
      where: {
        name: data[i].group
      }
    });

    for(let j = 0; j < data[i].events.length; j++)
      await group.createEvent(data[i].events[j]);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for(let i = 0; i < data.length; i++){

      await queryInterface.bulkDelete(options, {
        name: {
          [Op.in]: data[i].events.map(e => e.name)
        }
      });
     }
  }
};
