//Router route - /api/groups
const express = require('express');

const { Group, User, Image, Venue, Event, GroupMember, sequelize } = require('../../db/models');
const { body } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');

// Returns an error message if the group cannot be found
const checkForGroup = async (req, res, next) => {
    const groupId = req.params.groupId;

    let group;
    try {
        group = await Group.findByPk(groupId);
        if(!group) {
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }

        next();
    } catch (e) {
        next(e);
    }
};

// make sure group properties exist (give custom error instead of notNull violation)
const validateGroup = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be 60 characters or less'),
    body('about')
        .exists({ checkFalsy: true })
        .withMessage('About must be 50 characters or more'),
    body('type')
        .exists({ checkFalsy: true })
        .withMessage('Type must be \'Online\' or \'In person\''),
    body('private')
        .exists({ checkFalsy: false }) // need it to allow a false input to be provided
        .notEmpty()
        .withMessage('Private must be a boolean'),
    body('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    body('state')
        .exists({ checkFalsy: true })
        .withMessage('state is required'),
    handleValidationErrors
];

const validateImage = [
    body('url')
        .exists({ checkFalsy: true })
        .withMessage('Image rquires a url'),
    body('preview')
        .exists({ checkFalsy: false }) // need to be able to give a false value
        .withMessage('Preview must be a boolean'),
    handleValidationErrors
];

const validateVenue = [
    body('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    body('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    body('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    body('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    body('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    handleValidationErrors
]

const router = express.Router();

// Add an image to a group by Id
// LOOKS GOOD!
router.post('/:groupId/images', requireAuth, checkForGroup, validateImage, async (req, res) => {
    const { groupId }  = req.params;
    let { url, preview } = req.body;

    const group = await Group.findByPk(groupId);

    if(group.organizerId !== req.user.id) {
        res.status(403)
        return res.json({
            message: 'forbidden'
        })
    }

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
// LOOKS GOOD!
router.get('/:groupId/venues', requireAuth, checkForGroup, async (req, res, next) => {
    const { groupId } = req.params;
    let hasPermission = false;

    const group = await Group.scope('venues').findByPk(groupId);

    // Is the organizer
    if(group.organizerId === req.user.id) hasPermission = true;

    if(!hasPermission) {
        try {
            const membership = await GroupMember.findOne({
                where: { groupId, memberId: req.user.id }
            });

            //is a co-host
            if(membership && membership.status === 'co-host') hasPermission = true;
        } catch (e) {
            return next(e);
        }
    }

    if(hasPermission) res.json({ Venues: group.Venues });

    // Not the organizer, not a member, not a co-host
    res.status(403);
    return res.json({ message: 'Forbidden'});

});

// Create a venue for a group
// LOOKS GOOD!
router.post('/:groupId/venues', requireAuth, checkForGroup, validateVenue, async (req, res, next) => {
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    const group = await Group.findByPk(groupId);
    let hasPermission = false;

    if(group.organizerId === req.user.id) hasPermission = true;

    if(!hasPermission){
        try {
            const membership = await GroupMember.findOne({
                where: { groupId, memberId: req.user.id}
            });

            if(membership && membership.status === 'co-host') hasPermission = true;
        } catch (e) {
            return next(e);
        }
    }

    if(hasPermission) {
        let newVenue;
        try {
            newVenue = await group.createVenue({
                address, city, state,
                lat, lng: lng
            });
        } catch (e) {
            e.status(400);
            return next(e);
        }

        return res.json(newVenue);
    }

    res.status(403);
    return res.json({ message: 'Forbidden'});

});

// Get all of a group's events
router.get('/:groupId/events', checkForGroup, async (req, res) => {
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
router.post('/:groupId/events', checkForGroup, async (req, res) => {
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
router.get('/:groupId/members', checkForGroup, async (req, res) => {
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
router.post('/:groupId/members', checkForGroup, async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const group = await Group.findByPk(groupId);
    if(user) await group.addMember(user);

    res.json({ group });

});

// Edit a memebrship
router.put('/:groupId/members', requireAuth, checkForGroup, async (req, res, next) => {
    const { groupId } = req.params;
    const { memberId, status } = req.body;

    if(status === 'pending') {
        const err = new Error('Validations Error');
        err.status = 400;
        err.title = 'Validations Error';
        err.errors = { status: 'Cannot change a membership status to pending' }
        return next(err);
    }

    let user;
    try {
        user = await User.findByPk(memberId);
        if(!user) {
            const err = new Error('Validation Error');
            err.status = 400;
            err.title = 'Validation Error';
            err.errors = { status: 'User couldn\'t be found' }
            return next(err);
        }
    } catch (e) {
        return next(e);
    }

    let membership;
    try {
        membership = await GroupMember.findOne({
            where: {
                memberId,
                groupId
            },
            attributes: ['id', 'groupId', 'memberId', 'status']
        });

        if(!membership) {
            res.status()
        }

        membership.status = status;
        await membership.save();
    } catch (e) {
        return next(e);
    }

    return res.json({ membership });
});

// Return a specific group
// LOOKS GOOD!
router.get('/:groupId', checkForGroup, async (req, res) => {
    const { groupId } = req.params;

    // Including the other models breaks the numMembers count????
    // UGGGHHH Just accept defeat and make a second query for the rest of the data
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
// LOOKS GOOD!
router.put('/:groupId', requireAuth, checkForGroup, validateGroup, async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body;

    const group = await Group.scope(null).findByPk(groupId, {
        attributes: {
            exclude: ['previewImage']
        }
    });

    if(group.organizerId !== req.user.id) {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }

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
        e.status = 400;
        return next(e);
    }

    res.json(group);
});

// Delete a group
// LOOKS GOOD!
router.delete('/:groupId', requireAuth, checkForGroup, async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    if(req.user.id !== group.organizerId) {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }

    await group.destroy();
    res.json({ message: 'Successfully deleted' });

});

// Return all groups
// LOOKS GOOD!
router.get('/', async (_req, res) => {

    const allGroups = await Group.scope('memberScope').findAll();

    return res.json({
        Groups: allGroups
    });
});

// LOOKS GOOD!
// Create a new group
router.post('/', requireAuth, validateGroup, async (req, res, next) => {
    let { name, about, type, private, city, state, previewImage } = req.body;

    let newGroup;
    try {
        newGroup = await req.user.createOwnedGroup({
            name, about, type,
            private, city, state, previewImage
        });
    } catch (e) {
        e.status = 400;
        return next(e);
    }

    return res
        .status(201)
        .json({
            newGroup
        })
});

// Export router
module.exports = router;
