//Router route - /api/groups
const express = require('express');

const { Group, User, Image, Venue, Event, GroupMember, sequelize } = require('../../db/models');
const { body } = require('express-validator');
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
];

const validateEvent = [
    body('venueId')
        .custom( async val => {
            let venue;
            try {
                venue = await Venue.findByPk(val);
                if(!venue) {
                    throw new Error('Venue does not exist');
                }
            } catch (e) {
                throw new Error('Venue does not exist');
            }
        }),
    body('name')
        .exists({ checkFalsy: true})
        .isLength({ min: 5})
        .withMessage('Name must be at least 5 characters'),
    body('type')
        .exists({ checkFalsy: true})
        .isIn(['In person', 'Online'])
        .withMessage('Type must be Online or In person'),
    body('capacity')
        .exists({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Capacity must be an integer'),
    body('price')
        .exists({ checkFalsy: false })
        .isFloat({ min: 0.0 })
        .withMessage('Price is invalid'),
    body('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    body('startDate')
        .exists({ checkFalsy: true })
        .isAfter({ comparisonDate: Date().toString()})
        .withMessage('Start date must be in the future'),
    body('endDate')
        .exists({ checkFalsy: true })
        .isAfter(body.startDate)
        .withMessage('End date is less than start date'),
        handleValidationErrors
];

const router = express.Router();

// Delete an Image for an group
// LOOKS GOOD!
router.delete('/:groupId/images/:imageId', requireAuth, async (req, res, next) => {
    const { groupId, imageId } = req.params;
    let hasPermission = false;

    try {
        // Grab group
        const group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group Image couldn\'t be found'});
        }

        // Check if organizer
        if(req.user.id === group.organizerId) hasPermission = true;

        // If not organizer
        if(!hasPermission) {
            // Grab membership
            const membership = await GroupMember.findOne({
                where: { groupId: groupId, memberId: req.user.id}
            });
            if(!membership){
                res.status(403);
                return res.json({ message: 'Forbidden'});
            }

            // check if a co-host
            if(membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission){
            // grab image
            const groupImage = await Image.findOne({
                where: {
                    imageableId: groupId, id: imageId, imageType: 'groupImage'
                }
            });
            if(!groupImage) {
                res.status(404);
                return res.json({ message: 'Group Image couldn\'t be found'});
            }

            await groupImage.destroy();
            return res.json({ message: 'Successfully deleted' });
        }

        res.status(403);
        return res.json({ message: 'Forbidden' });

    } catch (e) {
        return next(e);
    }
});

// #Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const { groupId }  = req.params;
    let { url, preview } = req.body;
    let hasPermission = false;

    try {
        const group = await Group.findByPk(groupId);
        if(!group) {
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found' });
        }
        if(group.organizerId === req.user.id) hasPermission = true;

        if(hasPermission) {
            const newImage = await group.createGroupImage({
                url,
                preview
            });

            return res.json({
                id: newImage.id,
                url,
                preview
            });
        }

        res.status(403)
        return res.json({ message: 'forbidden' });

    } catch (e) {
        return next(e);
    }
});

// #Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    let hasPermission = false;

    try {
        // Grab group
        const group = await Group.scope('venues').findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }

        // Is the organizer
        if(group.organizerId === req.user.id) hasPermission = true;

        if(!hasPermission) {
            const membership = await GroupMember.findOne({
                where: { groupId, memberId: req.user.id }
            });

            //is a co-host
            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission) res.json({ Venues: group.Venues });

        // Not the organizer, not a member, not a co-host
        res.status(403);
        return res.json({ message: 'Forbidden'});
    } catch (e) {
        return next(e);
    }
});

// #Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    let hasPermission = false;

    let group;
    try {
        group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }

        if(group.organizerId === req.user.id) hasPermission = true;

        if(!hasPermission){
            const membership = await GroupMember.findOne({
                where: { groupId, memberId: req.user.id}
            });

            if(membership && membership.status === 'co-host') hasPermission = true;
        }
    } catch (e) {
        return next(e);
    }

    if(hasPermission) {
        try {
            const newVenue = await group.createVenue({
                address, city, state,
                lat, lng: lng
            });

            return res.json(newVenue);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    } else {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }
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
router.post('/:groupId/events', requireAuth, checkForGroup, validateEvent, async (req, res, next) => {
    const { groupId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    let hasPermission = false;

    const group = await Group.findByPk(groupId);
    if(req.user.id === group.organizerId) hasPermission = true;

    if(!hasPermission) {
        try {
            const membership = await GroupMember.findOne({
                where: {
                    groupId,
                    memberId: req.user.id
                }
            })

            if(membership && membership.status === 'co-host') hasPermission = true;
        } catch (e) {
            return next (e);
        }
    }

    if(!hasPermission){
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }

    let newEvent;
    try {
        newEvent = await group.createEvent({
            venueId, name, type, capacity, price, description, startDate, endDate
        }, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    } catch (e) {
        return next(e);
    }

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

// Request a Membership for a Group based on the Group's id
router.post('/:groupId/members', checkForGroup, async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const group = await Group.findByPk(groupId);
    if(user) await group.addMember(user);

    res.json({ group });

});

// Change the status of a membership for a group specified by id
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
            res.status(404);
            return res.json({ message: 'Membership between the user and the group does not exist'});
        }

        membership.status = status;
        await membership.save();
        return res.json({ membership });
    } catch (e) {
        return next(e);
    }
});

// #Get details of a Group from an id
router.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;

    try {
        const group = await Group.unscoped().findByPk(groupId, {
            include: [
                {
                    association: 'Members',
                    attributes: [],
                    through: {
                        attributes: []
                    }
                },
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
            ],
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Members.id')), 'numMembers']
                ]
            },
            group: [
                ['Group.id'], ['GroupImages.id'], ['Venues.id']
            ]
        });

        if(group === null) {
            console.log('\n no group \n')
            console.log(group);
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'})
        }

        return res.json(group);

    } catch (e) {
        return next(e);
    }

});

// #Edit a Group
router.put('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body;

    let group;
    try {
        group = await Group.scope(null).findByPk(groupId, {
            attributes: {
                exclude: ['previewImage']
            }
        });
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }

        if(group.organizerId !== req.user.id){
            res.status(403);
            return res.json({ message: 'Forbidden'});
        }
    } catch (e) {
        return next(e);
    }

    try {
        if(name) group.name = name;
        if(about) group.about = about;
        if(type) group.type = type;
        if(private) group.private = private;
        if(city) group.city = city;
        if(state) group.state = state;

        await group.save();

        return res.json(group);
    } catch(e) {
        e.status = 400;
        return next(e);
    }
});

// #Delete a Group
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            res.json({ message: 'Group couldn\'t be found' });
        }

        if(group.organizerId === req.user.id){
            await group.destroy();
            res.json({ message: 'Successfully deleted' });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden' });
        }
    } catch (e) {
        return next(e);
    }
});

// #Get all Groups
router.get('/', async (_req, res) => {

    const allGroups = await Group.scope('memberScope').findAll({
        order: [['id']]
    });

    return res.json({
        Groups: allGroups
    });
});

// #Create a Group
router.post('/', requireAuth, validateGroup, async (req, res, next) => {
    let { name, about, type, private, city, state, previewImage } = req.body;

    let newGroup;
    try {
        newGroup = await req.user.createOwnedGroup({
            name, about, type,
            private, city, state, previewImage
        });

        res.status(201);
        return res.json(newGroup);
    } catch (e) {
        return next(e);
    }
});

// Export router
module.exports = router;
