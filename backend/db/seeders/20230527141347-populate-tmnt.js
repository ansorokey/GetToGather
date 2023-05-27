'use strict';
const bcrypt = require('bcryptjs');

const { User, Group, GroupMember, Event, EventAttendee, Image } = require('../models');

const users = [
  {
    firstName: 'Master',
    lastName: 'Splinter'
  },
  {
    firstName: 'Leonardo',
    lastName: 'Hamato'
  },
  {
    firstName: 'Donatello',
    lastName: 'Hamato'
  },
  {
    firstName: 'Raphael',
    lastName: 'Hamato'
  },
  {
    firstName: 'Michelangelo',
    lastName: 'Hamato'
  },
  {
    firstName: 'April',
    lastName: 'O\'Neil'
  },
  {
    firstName: 'Jesse',
    lastName: 'Gordon'
  },
]

const group = {
  name: "Heros in a halfshell",
  about: 'It\'s the lean, green, ninja team, On the scene, cool teens doin\' ninja things, So extreme, out the sewer, like laser beams, Get rocked with the Shell-shocked Pizza Kings',
  type: "In person",
  private: true,
  city: "New York",
  state: "NY"
}

const venues = [
  {
    address: "122 & 8th",
    city: "New York",
    state: "NY",
    lat: 40.7505,
    lng: 73.9934,
  },
]

const events = [
  {
    name: "Pizza party",
    type: "In person",
    capacity: 10,
    price: 18.50,
    description: "You bring the pepperoni and we'll bring the pow! Radical!",
    startDate: "2024-11-19 20:00:00",
    endDate: "2024-11-19 22:00:00",
  },
  {
    name: "Beat up the foot clan",
    type: "In person",
    capacity: 100,
    price: 0.0,
    description: "Time to bring some SLAM down on the CLAN and shred The Shredder!",
    startDate: "2024-12-19 20:00:00",
    endDate: "2024-12-20 22:00:00",
  }
]

const groupImages = [
  {
    url: 'www.The-Group-Preview-Image.com',
    preview: true
  },
  {
    url: 'www.The-Group-Backup-Preview.com',
    preview: true
  },
  {
    url: 'www.Picture-Of-An-Image.com/group',
    preview: false
  },
  {
    url: 'www.Hey-Look-A-Second-Picture.com/group',
    preview: false
  },
  {
    url: 'www.Triple-Picture-all-The-Way.com/group',
    preview: false
  }
]

const eventImages = [
  {
    url: 'www.The-Event-Preview-Image.com',
    preview: true
  },
  {
    url: 'www.The-Event-Backup-Preview.com',
    preview: true
  },
  {
    url: 'www.Picture-Of-An-Image.com/event',
    preview: false
  },
  {
    url: 'www.Hey-Look-A-Second-Picture.com/event',
    preview: false
  },
  {
    url: 'www.Triple-Picture-all-The-Way.com/event',
    preview: false
  }
]

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Demouser
    const demouser = await User.findOne({
      where: {
        username: 'demouser'
      }
    });

    // Users
    for(let i = 0; i < users.length; i++){
      const { firstName, lastName } = users[i];
      const mixed = firstName.toLowerCase() + lastName.toLowerCase();
      await User.create({
        firstName,
        lastName,
        username: mixed,
        email: mixed + '@email.com',
        hashedPassword: bcrypt.hashSync('password')
      })
    }

    // Group
    const curGroup = await demouser.createOwnedGroup(group);

    // Members
    for(let i = 0; i < users.length; i++){
      const { firstName, lastName } = users[i];
      const member = await User.findOne({
        where: { firstName, lastName }
      });
      await curGroup.addMember(member);
    }

    // Membership
    const allMembers = await GroupMember.findAll({
      where: {
        groupId: curGroup.id
      }
    });

    for(let i = 0; i < allMembers.length; i++){
      allMembers[i].status = 'member';
      if(i === 0) allMembers[i].status = 'co-host';
      await allMembers[i].save();
    }

    //Venues
    for(let i = 0; i < venues.length; i++){
      await curGroup.createVenue(venues[i]);
    }

    //Events
    for(let i = 0; i < events.length; i++){
      await curGroup.createEvent(events[i]);
    }

    // Attendance
    const allEvents = await Event.findAll({
      where: { groupId: curGroup.id }
    })

    const groupMembers = await curGroup.getMembers();
    for(let i = 0; i < groupMembers.length; i++){
      await EventAttendee.create({
        eventId: allEvents[0].id,
        userId: groupMembers[i].id,
        status: 'attending'
      });
    }

    // Group Images
    for(let i = 0; i < groupImages.length; i++){
      await curGroup.createGroupImage(groupImages[i]);
      if(groupImages[i].preview) {
        curGroup.previewImage = groupImages[i].url;
        await curGroup.save();
      }
    }

    // Event Images
    let event = await Event.findOne({
      where: { groupId: curGroup.id }
    });
    for(let i = 0; i < eventImages.length; i++){
      await event.createEventImage(eventImages[i]);
      if(eventImages[i].preview) {
        event.previewImage = eventImages[i].url;
        await event.save();
      }
    }

  },

  async down (queryInterface, Sequelize) {
    // Demouser
    const demouser = await User.findOne({
      where: {
        username: 'demouser'
      }
    });

    //Users
    for(let i = 0; i < users.length; i++){
      const { firstName, lastName } = users[i];
      await User.destroy({
        where: {
          firstName,
          lastName
        }
      })
    }

    //Group
    const curGroup = await Group.findOne({
      where: {
        name: group.name
      }
    });

    const groupId = curGroup.id;
    await Group.destroy({
      where: { id: groupId }
    });

    // GroupImages
    await Image.destroy({
      where: {
        imageType: 'groupImage',
        imageableId: groupId
      }
    })

    // EventImages
    let event = await Event.findOne({
      where: { groupId }
    });
    await Image.destroy({
      where: {
        imageType: 'eventImage',
        imageableId: event.id
      }
    })

    // Members
    // for(let i = 0; i < users.length; i++){
    //   const { firstName, lastName } = users[i];
    //   const member = await User.findOne({
    //     where: { firstName, lastName }
    //   });
    //   await curGroupMember.destroy({
    //     where: member
    //   });
    // }
  }
};
