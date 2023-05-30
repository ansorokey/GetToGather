'use strict';
const bcrypt = require('bcryptjs');

const { User, Group, GroupMember, Event, EventAttendee, Image } = require('../models');

const users = [
  {
    firstName: 'Aragorn',
    lastName: 'Strider'
  },
  {
    firstName: 'Frodo',
    lastName: 'Baggins'
  },
  {
    firstName: 'Sam',
    lastName: 'Gamgee'
  },
  {
    firstName: 'Pippin',
    lastName: 'Took'
  },
  {
    firstName: 'Merry',
    lastName: 'Brandybuck'
  },
  {
    firstName: 'Gandalf',
    lastName: 'theGrey'
  },
  {
    firstName: 'Gandalf',
    lastName: 'theWhite'
  },
]

const group = {
  name: "The Hobbitsesss",
  about: 'One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them, In the Land of Mordor where the Shadows lie.',
  type: "In person",
  private: false,
  city: "Middle-earth",
  state: "NZ"
}

const venues = [
  {
    address: "Amon Amarth",
    city: "Mordor",
    state: "NZ",
    lat: 41.2924,
    lng: 174.7787,
  },
]

const events = [
  {
    name: "Second Breakfast",
    type: "In person",
    capacity: 7,
    price: 0.00,
    description: "Yes, we may have already had one, but what about second breakfast? Surely you know of second breakfast.",
    startDate: "2024-07-13 10:00:00",
    endDate: "2024-07-13 11:00:00",
  },
  {
    name: "Walk into Mordor",
    type: "Online",
    capacity: 1,
    price: 6.99,
    description: "Virtual event! Hop on roblox and tour through a 1:24 recreation of Mount Doom!",
    startDate: "2099-10-09 08:30:00",
    endDate: "2099-11-21 13:45:00",
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
    const eventNames = events.map( obj => obj.name);
    let deleteEvents = await Event.findAll({
      where: {
        name: eventNames
      }
    });
    for(let i = 0; i < deleteEvents.length; i++){
      await Image.destroy({
        where: {
          imageType: 'eventImage',
          imageableId: deleteEvents[i].id
        }
      });
    }

  }
};
