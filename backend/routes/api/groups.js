//Router route - /api/groups
const express = require('express');

const { Op } = require('sequelize');
const { body } = require('express-validator');
const { requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const { Group, User, Image, Venue, GroupMember, sequelize } = require('../../db/models');

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

const validateEvent = [
    body('venueId')
        .custom( async val => {
            if(val === undefined) return true;
            try {
                const venue = await Venue.findByPk(val);
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
        .isAfter({ comparisonDate: Date().toString() })
        .withMessage('Start date must be in the future'),
    body('endDate')
        .exists({ checkFalsy: true })
        .custom( ( val, { req } ) => {
            if(new Date(val) <= new Date(req.body.startDate)) throw new Error('End date is less than start date')
            return true;
        } )
        .withMessage('End date is less than start date'),
        handleValidationErrors
];

const router = express.Router();

// #Delete an Image for a Group
router.delete('/:groupId/images/:imageId', requireAuth, async (req, res, next) => {
    const { groupId, imageId } = req.params;
    let hasPermission = false;
    let replace = false;

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
                where: { groupId, memberId: req.user.id}
            });
            if(membership && membership.status === 'co-host') hasPermission = true;
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

            if(groupImage.preview) replace = true;

            await groupImage.destroy();
            if(replace){
                const replacementImage = await Image.findOne({
                    where: {
                        imageableId: groupId, imageType: 'groupImage', preview: true
                    }
                });

                group.set({ previewImage: replacementImage ? replacementImage.url : null });
                await group.save();
            }

            return res.json({ message: 'Successfully deleted' });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden' });
        }
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

            if(preview) {
                group.previewImage = url;
                await group.save();
            }

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

            return res.json({
                id: newVenue.id,
                groupId: newVenue.groupId,
                address: newVenue.address,
                city: newVenue.city,
                state: newVenue.state,
                lat: newVenue.lat,
                lng: newVenue.lng
            });
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    } else {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }
});

// #Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res, next) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByPk(groupId, {
            where: { id: {
                [Op.gt]: 0
            }}
        });
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'})
        }
        const events = await group.getEvents({
            include: [
                {
                    association: 'Attendance',
                    attributes: [],
                    through: {
                      attributes: [],
                      where: { status: 'attending' }
                    }
                  },
                  {
                    association: 'Group',
                    attributes: ['id', 'name', 'city', 'state']
                  },
                  {
                    association: 'Venue',
                    attributes: ['id', 'city', 'state']
                  }
            ],
            attributes: {
                exclude: ['price', 'capacity', 'createdAt', 'updatedAt']
            },
            order: [['startDate']]
        });

        for(let i = 0; i < events.length; i++){
            events[i].dataValues.numAttending = await events[i].countAttendingCount({
                where: {
                    status: 'attending'
                }
            });
        }

        res.json({Events: events});
    } catch (e) {
        return next(e);
    }
});

// #Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, validateEvent, async (req, res, next) => {
    const { groupId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate, previewImage } = req.body;
    let hasPermission = false;

    try {
        const group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }
        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission) {
            const membership = await GroupMember.findOne({
                where: {
                    groupId,
                    memberId: req.user.id
                }
            })

            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission){
            const newEvent = await group.createEvent({
                venueId, name, type, capacity, price, description, startDate, endDate, previewImage
            });

            res.json({
                id: newEvent.id,
                groupId: newEvent.groupId,
                venueId: newEvent.venueId || null,
                name,
                type,
                capacity,
                price,
                description,
                startDate,
                endDate,
                previewImage
            });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden'});
        }

    } catch(e) {
        return next(e);
    }
});

// #Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res, next) => {
    const { groupId } = req.params;
    let hasPermission = false;
    const statusArr = ['co-host', 'member']
    let group;
    try {

        if(req.user){
            group = await Group.findByPk(groupId);
            if(!group){
                res.status(404);
                return res.json({ message: 'Group couldn\'t be found' });
            }
            if(group.organizerId === req.user.id) hasPermission = true;

            if(!hasPermission){
                const membership = await GroupMember.findOne({
                    where: { memberId: req.user.id, groupId: group.id}
                });
                if(membership && membership.status === 'co-host') hasPermission = true;
            }
        }

        if(hasPermission) statusArr.push('pending');

        const groupMembers = await User.findAll({
            attributes: {
                exclude: ['username'],
            },
            include: {
                association: 'Membership',
                where: {
                    groupId,
                    status: statusArr
                },
                attributes: ['status']
            }
        })
        res.json({Members: groupMembers});
    } catch(e) {
        return next(e);
    }
});

// #Request a Membership for a Group based on the Group's id
router.post('/:groupId/members', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found' });
        }

        const membership = await GroupMember.findOne({
            where: { groupId, memberId: req.user.id }
        });
        if(membership && membership.status === 'pending'){
            res.status(400);
            return res.json({ message: 'Membership has already been requested' });
        }
        if(membership && (membership.status === 'member' || membership.status === 'co-host')){
            res.status(400);
            return res.json({ message: 'User is already a member of the group' });
        }

        await group.addMember(req.user);

        res.json({ memberId: +req.user.id, status: 'pending' });
    } catch (e) {
        return next(e);
    }
});

// #Change the status of a membership for a group specified by id
router.put('/:groupId/members', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { memberId, status } = req.body;
    let hasPermission = false;
    let hasAdmin = false;


    try {
        const member = await User.findByPk(memberId);
        if(!member) {
            const err = new Error('Validation Error');
            err.status = 404;
            err.title = 'Validation Error';
            err.errors = { status: 'User couldn\'t be found' }
            return next(err);
        }

        if(status === 'pending') {
            const err = new Error('Validations Error');
            err.status = 400;
            err.title = 'Validations Error';
            err.errors = { status: 'Cannot change a membership status to pending' }
            return next(err);
        }

        const membership = await GroupMember.findOne({
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

        const group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found' });
        }
        if(req.user.id === group.organizerId) {
            hasAdmin = true;
            hasPermission = true;
        }

        if(!hasPermission){
            const cohost = await GroupMember.findOne({
                where: { groupId, memberId: req.user.id }
            });
            if(cohost && cohost.status === 'co-host'){
                hasPermission = true;
            }
        }

        if(hasPermission){
            if(status === 'co-host' && !hasAdmin){
                res.status(403);
                return res.json({ message: 'Forbidden' });
            }
            membership.status = status;
            await membership.save();
            return res.json({
                id: membership.id,
                groupId: membership.groupId,
                memberId: membership.memberId,
                status: membership.status
            });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden' });
        }
    } catch (e) {
        return next(e);
    }
});

// #Delete membership to a group specified by id
router.delete('/:groupId/members', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    let hasPermission = false;

    try {

        const member = await User.findByPk(memberId);
        if(!member) {
            const err = new Error('Validation Error');
            err.status = 404;
            err.title = 'Validation Error';
            err.errors = { status: 'User couldn\'t be found' }
            return next(err);
        }

        const group = await Group.findByPk(groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found' });
        }
        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission) {
            if(memberId === req.user.id) hasPermission = true;
        }

        const membership = await GroupMember.findOne({
            where: { memberId, groupId }
        });
        if(!membership) {
            res.status(404);
            return res.json({ message: 'Membership does not exist for this User' })
        }

        if(hasPermission){
            await group.removeMember(member);
            return res.json({ 'message': 'Successfully deleted membership from group' });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden' });
        }

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
                        attributes: [],
                        where: {
                            status: {
                                [Op.or]: ['member', 'co-host']
                            }
                        }
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
                },
                {
                    association: 'Events',
                    attributes: ['id']
                  }
            ],
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Members.id')), 'numMembers']
                ]
            },
            group: [
                ['Group.id'], ['GroupImages.id'], ['Venues.id'], ['Organizer.id'], ['Events.id']
            ]
        });

        if(group === null) {
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'})
        }

        group.dataValues.numMembers = Number.parseInt(group.dataValues.numMembers);
        return res.json(group);

    } catch (e) {
        return next(e);
    }

});

// #Edit a Group
router.put('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state, previewImage } = req.body;

    let group;
    try {
        group = await Group.scope(null).findByPk(groupId);
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
        if(previewImage) group.previewImage = previewImage;

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
router.get('/', async (_req, res, next) => {

    const allGroups = await Group.scope(null).findAll({
        include: [{
            association: 'Members',
            attributes: [],
            through: {
              attributes: [],
              where: {
                status: ['member', 'co-host']
              }
            }
          },
          {
            association: 'Events',
            attributes: ['id']
          }
        ],
          attributes: {
            include: [
              [
                sequelize.fn("COUNT", sequelize.col("Members.id")),
                "numMembers"
              ],
              [
                sequelize.fn("COUNT", sequelize.col("Events.id")),
                "numEvents"
              ]
            ],
          },
          group: [[sequelize.col('Group.id')], [sequelize.col('Events.id')]]
    });

    for(let i = 0; i < allGroups.length; i++){
        allGroups[i].dataValues.numMembers = Number.parseInt(allGroups[i].dataValues.numMembers);
        allGroups[i].dataValues.numEvents = Number.parseInt(allGroups[i].Events.length);
    }

    return res.json({ Groups: allGroups });
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
