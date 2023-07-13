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
        startDate: "2023-07-14 01:00:00",
        endDate: "2023-07-14 23:00:00",
        previewImage: 'https://tellusmuseum.org/wp-content/uploads/2020/05/Fossil-Dig-and-Gem-Panning-1024x1024.png'
      },
      {
        name: "Brunch-iosaurus",
        type: "In person",
        capacity: 20,
        price: 9.99,
        description: "Not quite breakfast, not quite lunch. Perfectly deliucious. Drop on by the Stegasorus Steakhouse and socialize with fellow shaving cream conniseurs.",
        startDate: "2023-07-15 09:00:00",
        endDate: "2023-07-15 12:00:00",
        previewImage: 'https://pbs.twimg.com/media/CftPYb2WsAAgBWR.jpg'
      },
      {
        name: "Dino-DNA Presentation",
        type: "Online",
        capacity: 100,
        price: 1.99,
        description: "Come and see what a mosquito and a little bit of tree sap can do for science. Narrated By Jeff Goldblum.",
        startDate: "2023-08-23 15:00:00",
        endDate: "2023-08-23 16:00:00",
        previewImage: 'https://i.ytimg.com/vi/qUaFYzFFbBU/hqdefault.jpg'
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
        startDate: "2023-07-14 16:00:00",
        endDate: "2023-07-14 17:00:00",
        previewImage: 'https://takecaretahoe.org/wp-content/uploads/2018/05/SmokeyBearHead.jpg'
      },
      {
        name: "CPR for Dummies, on Dummies",
        type: "In person",
        capacity: 30,
        price: 4.99,
        description: "Summer needs lifeguards, and lifeguards need training. Rouge Cross certification available upon completion.",
        startDate: "2023-07-25 10:00:00",
        endDate: "2023-07-25 12:00:00",
        previewImage: 'https://m.media-amazon.com/images/M/MV5BOTJiY2ZjNTEtNWRiMC00NGNjLWFlYmEtMTU0NzA2ZjgxZTRhXkEyXkFqcGdeQXVyODM4ODAzMTY@._V1_.jpg'
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
        previewImage: 'https://static.wikia.nocookie.net/animeandmangauniverse/images/3/32/Eight_Gates-Rock_Lee.jpg'
      },
      {
        name: "Laugh at Boruto",
        type: "Online",
        capacity: 100,
        price: 0.00,
        description: "I don't care how flashy this show is, it is an insult to the 5 Kage Summit. To all things Ninja. Dattebayo.",
        startDate: "2023-08-13 10:00:00",
        endDate: "2023-08-13 19:00:00",
        previewImage: 'https://preview.redd.it/9ytb9elj4qv81.png'
      },
      {
        name: "X-Games",
        type: "In person",
        capacity: 80,
        price: 10.00,
        description: "Skateboarding, surfing, and dirtbikes. We've got the skills to give you thrills. Watch our competitors ride like the wind!",
        startDate: "2023-07-14 07:00:00",
        endDate: "2023-07-14 19:00:00",
        previewImage: 'https://morphinlegacy.com/wp-content/uploads/2022/09/Tsunami-Cycles-Thunder-Rangers.png'
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
        startDate: "2023-07-15 15:00:00",
        endDate: "2023-07-15 17:00:00",
        previewImage: 'https://www.everythingmouse.com/wp-content/uploads/2020/08/ednamodenocapes1.jpg'
      },
      {
        name: "Staying Safe on the Internet",
        type: "Online",
        capacity: 15,
        price: 7.99,
        description: "Terminators? HAL? GLaDOS? The enslavement of humanity stops with you! Learn how to keep your calculator from calculating your demise from experts in tech.",
        startDate: "2025-07-15 15:00:00",
        endDate: "2025-07-15 17:00:00",
        previewImage: 'https://www.internetprivacy.com/wp-content/uploads/2021/09/dangers-of-the-internet-for-kids.jpg'
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
        previewImage: 'https://i.pinimg.com/originals/f8/79/45/f879454114ba556ec17210390c4b82ab.jpg'
      },
      {
        name: "Arrest The Skeleton of Al Capone",
        type: "In person",
        capacity: 1,
        price: 0.00,
        description: "Yes, he may be dead, but he was sentenced to 23 consecuitive life sentences. An unbeating heart is no excuse for an early release.",
        startDate: "2023-10-31 10:00:00",
        endDate: "2023-10-31 13:00:00",
        previewImage: 'https://i.redd.it/o6tpn6b4jrk51.jpg'
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
        previewImage: 'https://i1.sndcdn.com/artworks-YIUNRqvlWn9iQSC2-tNHg5Q-t500x500.jpg'
      },
      {
        name: "Time Machine Hot Tub",
        type: "In person",
        capacity: 6,
        price: 200.00,
        description: "Not to be confused with Hot Tub Time Machine. Catering provided by the 4th Dimension.",
        startDate: "3421-01-21 19:00:00",
        endDate: "3421-01-21 21:00:00",
        previewImage: 'https://images.tbs.com/tbs/$dyna_params/https%3A%2F%2Fi.cdn.tbs.com%2Fassets%2Fimages%2F2020%2F07%2FHot-Tub-Time-Machine-2-1600x900.jpg'
      },
      {
        name: "Rob Your Future Self",
        type: "In person",
        capacity: 1,
        price: 0.00,
        description: "Going back in time and changing the future is questionably wrong. Luckily, laws don't apply going forward. The success of tomorrow: TODAY!",
        startDate: "2043-07-11 10:00:00",
        endDate: "2043-07-11 11:00:00",
        previewImage: 'https://i0.wp.com/www.alittlebithuman.com/wp-content/uploads/2021/07/hamburglar.png'
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
        previewImage: 'https://www.sagegoddess.com/wp-content/uploads/2018/03/Wolf-Spirit-Animal-Screensaver.jpg'
      },
      {
        name: "Lie around with Lions",
        type: "In person",
        capacity: 18,
        price: 12.99,
        description: "The king of the jungle is often king of couch potatoes. Curl up into a ball and enjoy some Zebra Jerky with zero responsibility.",
        startDate: "2023-09-19 14:00:00",
        endDate: "2023-09-19 15:45:00",
        previewImage: 'https://i.pinimg.com/474x/7f/d0/87/7fd0876d9e0290c1ec6a3b57f336e675.jpg'
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
