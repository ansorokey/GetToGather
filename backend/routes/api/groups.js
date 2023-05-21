//Router route - /api/groups
const express = require('express');

const { Group, User, Image, Venue, Event, GroupMember, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');

const router = express.Router();

// Add an image to a group by Id
router.post('/:groupId/images', async (req, res) => {
    const { groupId }  = req.params;
    let { url, preview } = req.body;
    preview = preview === 'true' ? true : false;

    const group = await Group.findByPk(groupId);

    const newImage = await group.createGroupImage({
        url,
        preview
    });

    res.json({
        id: newImage.id,
        url,
        preview
    });
});

// Get all venues of a group
router.get('/:groupId/venues', async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.scope('venues').findByPk(groupId);
    res.json({ venues: group.Venues });
});

// Create a venue for a group
router.post('/:groupId/venues', async (req, res) => {
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    const group = await Group.findByPk(groupId);

    const newVenue = await group.createVenue({
        address, city, state,
        lat, lng: lng
    });

    res.json(newVenue);
});

// Get all a group's events
router.get('/:groupId/events', async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);
    const events = await group.getEvents({
        include: [
            {
                association: 'Group',
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                association: 'Venue',
                attributes: ['id', 'city', 'state']
            }
        ]
    });

    res.json(events);
});

// Create a new event from a group
router.post('/:groupId/events',async (req, res) => {
    const { groupId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const group = await Group.findByPk(groupId);
    const newEvent = await group.createEvent({
        venueId, name, type, capacity, price, description, startDate, endDate
    });

    res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

});

// Get all group members
router.get('/:groupId/members', async (req, res) => {
    const { groupId } = req.params;
    const { user } = req;
    let hasPermission = false;
    const statusArr = ['co-host', 'member']

    // Return the join table of all users in the matching groupId
    const groupUsers = await GroupMember.findAll({
        include: {
            model: Group,
            attributes: ['organizerId']
        },
        where: {
            groupId
        }
    });

    // Join table will be an array, grab the organizerId of index 0
    let organizerId;
    if(groupUsers.length){
        organizerId = groupUsers[0].Group.organizerId;
        // check is current user is group owner
        if(user.id === organizerId)hasPermission = true;
    }

    // iterate through array to check if current user is a co-host
    for(let i = 0; i < groupUsers.length; i++){
        let member = groupUsers[i];
        if(user.id === member.memberId && member.status === 'co-host') hasPermission = true;
    }

    if(hasPermission) statusArr.push('pending');

    const group = await Group.findByPk(groupId, {
        include: {
            association: 'Members',
            through: {
                as: 'Membership', // The name of a through table can be changed using as
                attributes: ['status'],
                where: {
                    status: statusArr

                }
            }
        },
        attributes: [] // No attributes, only need the members association
    });

    // res.json({Members: group});
    res.json({Members: group.Members});
});

// Request to join a group by id
router.post('/:groupId/members', async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const group = await Group.findByPk(groupId);
    if(user) await group.addMember(user);

    res.json({ group });

});

// Edit a memebrship
router.put('/:groupId/members', requireAuth, async (req, res) => {
    const { user } = req;
    const { groupId } = req.params;
    const { memberId, status } = req.body;
    let hasPermission = false;

    const membership = await GroupMember.findOne({
        where: {
            memberId: user.id,
            groupId
        },
        attributes: ['id', 'groupId', 'memberId', 'status']
    });

    membership.status = status;

    await membership.save();

    res.json({ membership });
});

// Return a specific group
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;

    // Including the other models breaks the numMembers count????
    // UGGGHHH JUst accept defeat and make a second query for the rest of the data

    const group = await Group.scope('memberScope').findByPk(groupId);
    const otherAssociations = await Group.unscoped().findByPk(groupId, {
        include: [
            {
                model: Image,
                as: 'GroupImages',
                attributes: ['id', 'url', 'preview']
            },
            {
                association: 'Organizer',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
            }
        ]
    });
    let jsonGroup = group.toJSON();

    res.json({
        ...jsonGroup,
        GroupImages: otherAssociations.GroupImages,
        Organizer: otherAssociations.Organizer,
        Venues: otherAssociations.Venues
     });
});

// Edit a group by Id
router.put('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body;

    const group = await Group.findByPk(groupId);
    if(name) group.name = name;
    if(about) group.about = about;
    if(type) group.type = type;
    if(private) group.private = private;
    if(city) group.city = city;
    if(state) group.state = state;
    try {
        //the validate method doesnt work the way I thought it did
        //crashes the server, valiadtion errors are returned without it
        // group.validate();
        await group.save();
    } catch (e) {
        return next(e);
    }

    res.json(group);
});

// Delete a group
router.delete('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    // Check if there is a user logged in
    if(!user) {
        res.status(401);
        return res.json({ message: 'Authentication required'});
    }

    // Look for group
    let group;
    try {
        group = await Group.findByPk(groupId);
        if(!group) {
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }
    } catch (e) {
        return next(e);
    }

    // Check if current user owns the group
    if(user.id !== group.organizerId) {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }

    await group.destroy();
    res.json({
        message: 'Successfully deleted'
    });

});

// Return all groups
router.get('/', async (req, res) => {

    const allGroups = await Group.scope(['defaultScope','memberScope']).findAll();

    res.json({
        Groups: allGroups
    });
});

// Create a new group
router.post('/', async (req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const { name, about, type, private, city, state, previewImage } = req.body;

    const newGroup = await user.createOwnedGroup({
        name, about, type,
        private, city, state, previewImage
    });

    res.json({
        newGroup
    })
});

// Export router
module.exports = router;
