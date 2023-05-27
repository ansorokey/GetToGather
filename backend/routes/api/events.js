const express = require('express');

const { Op } = require('sequelize');
const { body } = require('express-validator');
const { query } = require('express-validator');
const { requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Image, Event, Venue, Group, GroupMember, EventAttendee, sequelize } = require('../../db/models');

// Middleware to Validate Query params
const validateQuery = [
    query('page')
    .custom( val => {
        //if not provided, will be falsey dy default, dont need to check
        if(!val) return true;

        //need to parse the val to check if NaN
        if(Number.isNaN(+val) || +val < 1) throw new Error('Page must be greater than or equal to 1');

        return true;
    }),
    query('size')
    .custom( val => {
        if(!val) return true;

        if(Number.isNaN(+val) || +val < 1) throw new Error('Size must be greater than or equal to 1');

        return true;
    }),
    query('name')
    .custom( val => {
        if(!val) return true;

        const regex = new RegExp(/^[a-zA-Z]+$/);
        if(!regex.test(val)) throw new Error('Name must be a string');

        return true;
    }),
    query('type')
    .custom( val => {
        if(!val) return true;

        if(val !== 'Online' && val !== 'In person') throw new Error("Type must be 'Online' or 'In Person'");

        return true;
    }),
    query('startDate')
    .custom( val => {
        if(!val) return true;

        if(Number.isNaN(Date.parse(val))) throw new Error('Start date must be a valid datetime');

        return true;
    }),
    handleValidationErrors
];

const validateEventEdit = [
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
    // body('name')
    //     .isLength({ min: 5})
    //     .withMessage('Name must be at least 5 characters'),
    // body('type')
    //     .isIn(['In person', 'Online'])
    //     .withMessage('Type must be Online or In person'),
    // body('capacity')
    //     .isInt({ min: 1 })
    //     .withMessage('Capacity must be an integer'),
    // body('price')
    //     .isFloat({ min: 0.0 })
    //     .withMessage('Price is invalid'),
    // // body('description')
    // //     .withMessage('Description is required'),
    // body('startDate')
    //     .isAfter({ comparisonDate: Date().toString()})
    //     .withMessage('Start date must be in the future'),
    // body('endDate')
    //     .isAfter(body.startDate)
    //     .withMessage('End date is less than start date'),
        handleValidationErrors
];

const router = express.Router();

// Delete an Image for an Event
router.delete('/:eventId/images/:imageId', requireAuth, async (req, res, next) => {
    const { eventId, imageId } = req.params;
    let hasPermission = false;
    let replace = false;

    try {
        // Grab Event
        const event = await Event.findByPk(eventId);
        if(!event){
            res.status(404);
            return res.json({ message: 'Event Image couldn\'t be found'});
        }

        // Grab group
        const group = await Group.findByPk(event.groupId);
        if(req.user.id === group.organizerId) hasPermission = true;

        // If not organizer
        if(!hasPermission) {
            // Grab membership
            const membership = await GroupMember.findOne({
                where: { groupId: group.id, memberId: req.user.id}
            });

            // check if a co-host
            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission){
            // grab image
            const eventImage = await Image.findOne({
                where: {
                    imageableId: eventId, id: imageId, imageType: 'eventImage'
                }
            });
            if(!eventImage) {
                res.status(404);
                return res.json({ message: 'Event Image couldn\'t be found'});
            }

            if(eventImage.preview) replace = true;
            await eventImage.destroy();
            if(replace){
                const replacementImage = await Image.findOne({
                    where: {
                        imageableId: eventId, imageType: 'eventImage', preview: true
                    }
                });
                event.set({ previewImage: replacementImage ? replacementImage.url : null });
                await event.save();
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

// #Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const { url, preview } = req.body;
    let hasPermission = false;

    try {
        const event = await Event.findByPk(eventId);
        if(!event) {
            res.status(404);
            return res.json({ message: 'Event couldn\'t be found'});
        }
        const group = await Group.findByPk(event.groupId);
        if(!group) {
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }
        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission){
            const membership = await GroupMember.findOne({
                where: { groupId: group.id, memberId: req.user.id }
            });
            if(!membership) {
                res.status(404);
                return res.json({ message: 'Forbidden'});
            }
            if(membership.status === 'co-host') hasPermission = true;
        }

        if(!hasPermission){
            const attendance = await EventAttendee.findOne({
                where: { eventId, userId: req.user.id }
            });
            if(!attendance) {
                res.status(404);
                return res.json({ message: 'Forbidden'});
            }
            if(attendance.status === 'attending') hasPermission = true;
        }

        if(hasPermission){
            const newEventImage = await event.createEventImage({
                url, preview
            });

            if(preview) {
                event.previewImage = url;
                await event.save();
            }

            return res.json({
                id: newEventImage.id,
                url, preview
            });
        } else {
            res.status(404);
            return res.json({ message: 'Forbidden'});
        }
    } catch (e) {
        return next(e);
    }
});

// #Get all Attendees of an Event specified by its id
router.get('/:eventId/attendance', async (req, res, next) => {
    const { eventId } = req.params;
    let status = ['attending', 'waitlist'];
    let hasPermission = false;

    try {
        // Grab event
        const event = await Event.findByPk(eventId);
        if(!event){
            res.status(404);
            return res.json({ message: 'Event couldn\'t be found'});
        }

        if(req.user) {
            // check Group
            const group = await Group.findByPk(event.groupId);
            if(group.organizerId === req.user.id) hasPermission = true;

            if(!hasPermission){
                // Check membership
                const membership = await GroupMember.findOne({
                    where: { groupId: event.groupId, memberId: req.user.id }
                });
                if(membership && membership.status === 'co-host') hasPermission = true;
            }
        }

        if(hasPermission) status.push('pending');

        // Grab attendees
        const attendingUsers = await User.findAll({
            attributes: {
                exclude: ['username']
            },
            include: {
                association: 'Attendance',
                attributes: ['status'],
                required: true,
                where: { eventId, status }
            }
        });

        res.json({ Attendees: attendingUsers });
    } catch (e) {
        return next(e);
    }
});

// #Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;

    try {
        // Grab event
        const event = await Event.findByPk(eventId);
        if(!event) {
            res.status(404);
            return res.json({ message: 'Event couldn\'t be found'});
        }

        // Grab group
        const membership = await GroupMember.findOne({
            where: {groupId: event.groupId, memberId: req.user.id }
        });
        if(!membership || membership.status === 'pending'){
            res.status(403);
            return res.json({ message: 'Forbidden'});
        }

        // Check if they've already requested attendance
        const attendance = await EventAttendee.findOne({
            where: { userId: req.user.id, eventId }
        });
        if(attendance){
            if(attendance.status === 'pending' || attendance.status === 'waitlist'){
                res.status(400);
                return res.json({ message: 'Attendance has already been requested' });
            } else {
                res.status(400);
                return res.json({ message: 'User is already an attendee of the event' });
            }

        }

        // Add attendance as pending
        await event.addAttendance(req.user);

        return res.json({
            userId: req.user.id,
            status: 'pending'
        });
    } catch (e) {
        return next(e);
    }
});

// #Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const { userId, status } = req.body;
    let hasPermission = false;

    if(status === 'pending') {
        res.status(400);
        return res.json({ message: 'Cannot change an attendance status to pending'});
    }

    try {
        //Check attendance
        const attendance = await EventAttendee.findOne({
            where: { eventId, userId },
            attributes: {
                include: ['id']
            }
        });
        if(!attendance){
            res.status(404);
            return res.json({ message: 'Attendance between the user and the event does not exist' });
        }

        // Grab event
        const event = await Event.findByPk(eventId);
        if(!event) {
            res.status(404);
            return res.json({ message: 'Event couldn\'t be found' });
        }

        // Grab group
        const group = await Group.findByPk(event.groupId);
        if(group.organizerId === req.user.id) hasPermission = true;

        if(!hasPermission){
            // Grab membership
            const membership = await GroupMember.findOne({
                where: { groupId: group.id, memberId: req.user.id }
            });
            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission){
            attendance.status = status;
            await attendance.save();
            res.json({
                id: +attendance.id,
                eventId: +eventId,
                userId,
                status
            });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden' });
        }
    } catch (e) {
        return next(e);
    }
});

router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const { userId } = req.body;
    let hasPermission = false;

    try {
        const event = await Event.findByPk(eventId);
        if(!event) {
            res.status(404);
            return res.json({ message: 'Event couldn\'t be found' });
        }

        const attendance = await EventAttendee.findOne({
            where: { eventId, userId}
        });
        if(!attendance){
            res.status(404);
            return res.json({ message: 'Attendance does not exist for this User' });
        }

        let group = await Group.findByPk(event.groupId);
        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission){
            if(+req.user.id === +userId) hasPermission = true;
        }

        if(hasPermission){
            const user = await User.findByPk(userId);
            await event.removeAttendance(user);
            return res.json({ message: 'Successfully deleted attendance from event' });
        } else {
            res.status(404);
            return res.json({ message: 'Only the User or organizer may delete an Attendance' });
        }
    } catch (e) {
        return next(e);
    }
});

// #Get details of an Event specified by its id
router.get('/:eventId', async (req, res, next) => {
    const { eventId } = req.params;

    try{
        const event = await Event.scope(null).findByPk(eventId, {
            include: [
                {
                  association: 'Group',
                  attributes: ['id', 'name', 'city', 'state', 'private']
                },
                {
                  association: 'Venue',
                  attributes: ['id', 'city', 'state', 'address', 'lat', 'lng']
                },
                {
                    model: Image,
                    as: 'EventImages',
                    attributes: ['id', 'url', 'preview']
                }
              ],
              attributes: {
                include: [
                    [sequelize.col('Event.id'), 'numAttending']
                ],
                exclude: ['createdAt', 'updatedAt', 'previewImage']
              }
        });

        if(!event) return res.json({message: "Event couldn't be found"});

        const numAttending = await event.countAttendingCount({
            where: { status: 'attending' }
        });

        event.dataValues.numAttending = numAttending;

        res.json(event);
    } catch(e){
        return next(e);
    }
});

// #Edit an Event specified by its id
router.put('/:eventId', validateEventEdit, async (req, res, next) => {
    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    let hasPermission = false;

    try {
        const event = await Event.findByPk(eventId, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if(!event){
            res.status(404);
            return res.json({ message: 'Event couldn\'t be found' });
        }

        const group = await Group.findByPk(event.groupId);
        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission){
            const membership = await GroupMember.findOne({
                where: { memberId: req.user.id, groupId: group.id}
            })
            if(membership && membership.status == 'co-host') hasPermission = true;
        }

        if(hasPermission){
            // Does venue belong to current group?


            if(venueId) {
                const venue = await Venue.findByPk(venueId);
                if(group.id !== venue.groupId){
                    res.status(403);
                    return res.json({ message: 'Forbidden' });
                }
                event.venueId = venueId;
            }
            if(name) event.name = name;
            if(type) event.type = type;
            if(capacity) event.capacity = capacity;
            if(price) event.price = price;
            if(description) event.description = description;
            if(startDate) event.startDate = startDate;
            if(endDate) event.endDate = endDate;
            await event.save();
            res.json(event);
        } else {
            res.status(403);
            return res.json({ message: 'Forbiden' });
        }
    } catch (e) {
        return next(e);
    }
});

// #Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    let hasPermission = false;

    try {
        const event = await Event.findByPk(eventId);
        if(!event) {
            res.status(404);
            return res.json({message: 'Event couldn\'t be found'});
        }

        const group = await Group.findByPk(event.groupId);
        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission) {
            const membership = await GroupMember.findOne({
                where: { memberId: req.user.id, groupId: group.id}
            });
            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission){
            await event.destroy();
            return res.json({ message: 'Successfully deleted' });
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden' });
        }
    } catch (e) {
        return next(e);
    }
});

// #Get all Events
router.get('/', validateQuery, async (req, res, next) => {
    const page = req.query.page || 1;
    const size = req.query.size || 20;
    const { name, type, startDate } = req.query;

    if(+page > 10) page = 10;
    if(+size > 20) size = 20;

    let limit = size;
    let offset = size * (page - 1);

    const where = {};
    if(name) where.name = { [Op.like]: `%${name}%`};
    if(type) where.type = type;
    if(startDate) where.startDate = { [Op.gte]: startDate};

    const allEvents = await Event.scope('allMembers').findAll({
        attributes: {
            exclude: ['capacity', 'price', 'description']
        },
        group: [['Event.id'], ['Group.id'], ['Venue.id']],
        where,
        // THE LIMIT IS WHAT BROKE MY AGGREGATE????
        limit,
        offset,
        subQuery: false
    });

    return res.json({ Events: allEvents });
});

// Export router
module.exports = router;
