const express = require('express');
const { Op } = require('sequelize');
const { User, Image, Event, Group, GroupMember, EventAttendees, sequelize } = require('../../db/models');
const { body } = require('express-validator');
const { query } = require('express-validator');
const { requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation');

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

        console.log('\n\n reached \n\n');
        if(Number.isNaN(Date.parse(val))) throw new Error('Start date must be a valid datetime');

        console.log('\n\n aslo reached \n\n');
        // if(val !== 7) throw new Error('Start date must be a valid datetime');
        return true;
    }),
    handleValidationErrors
];

const validateImage = [
    body('url')
        .exists({ checkFalsy: true })
        .withMessage('Image requires a url'),
    body('preview')
        // .exists({ checkFalsy: false }) // need to be able to give a false value
        .custom( val => {
            console.log(val);
            if(typeof val !== 'boolean') throw new Error('Preview must be a boolean');
            return true;
        })
        .withMessage('Preview must be a boolean'),
    handleValidationErrors
];

const router = express.Router();

// Delete an Image for an event
// LOOKS GOOD!
router.delete('/:eventId/images/:imageId', requireAuth, async (req, res, next) => {
    const { eventId, imageId } = req.params;
    let hasPermission = false;

    try {
        // Grab Event
        const event = await Event.findByPk(eventId);
        if(!event){
            res.status(404);
            return res.json({ message: 'Event Image couldn\'t be found'});
        }

        // Grab group
        const group = await Group.findByPk(event.groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Event Image couldn\'t be found'});
        }

        // Check if organizer
        if(req.user.id === group.organizerId) hasPermission = true;

        // If not organizer
        if(!hasPermission) {
            // Grab membership
            const membership = await GroupMember.findOne({
                where: { groupId: group.id, memberId: req.user.id}
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
            const eventImage = await Image.findOne({
                where: {
                    imageableId: eventId, id: imageId, imageType: 'eventImage'
                }
            });
            if(!eventImage) {
                res.status(404);
                return res.json({ message: 'Event Image couldn\'t be found'});
            }

            await eventImage.destroy();
            return res.json({ message: 'Successfully deleted' });
        }

        res.status(403);
        return res.json({ message: 'Forbidden' });

    } catch (e) {
        return next(e);
    }
});

// Add image to an event by Id
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

        if(hasPermission){
            const newEventImage = await event.createEventImage({
                url, preview
            });

            return res.json({
                id: newEventImage.id,
                url, preview
            });
        }

        res.status(404);
        return res.json({ message: 'Forbidden'});

    } catch (e) {
        return next(e);
    }
});

// Get all Attendees of an Event specified by its id
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
            include: {
                association: 'Attendance',
                attributes: ['status'],
                required: true,
                where: { status }
            }
        });

        res.json({ Attendees: attendingUsers });
    } catch (e) {
        return next(e);
    }
});

// Request to Attend an Event based on the Event's id
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
        const attendance = await EventAttendees.findOne({
            where: { userId: req.user.id, eventId
            }
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
        await event.addAttending(req.user);

        return res.json({
            userId: req.user.id,
            status: attendance.status
        });
    } catch (e) {
        return next(e);
    }
});

// Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async (res, req, next) => {
    const { eventId } = req.params;
    const { userId, status } = req.body;
    let hasPermission = false;

    if(status === 'pending') {
        res.status(400);
        return res.json({ message: 'Cannot change an attendance status to pending'});
    }

    try {

        //Check attendance
        const attendance = await EventAttendees.findOne({
            where: { eventId, userId }
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
                where: { groupId: group.id, memebrId: req.user.id }
            });
            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if(hasPermission){
            attendance.status = status;
            await attendance.save();
            res.json(attendance);
        }

        res.status(403);
        return res.json({ message: 'Forbidden' });

    } catch (e) {
        return next(e);
    }
});

// Return event by id
router.get('/:eventId', async (req, res, next) => {
    const { eventId } = req.params;

    let event;
    try{
        event = await Event.findByPk(eventId, {
            include: [
                {
                    association: 'Group',
                    attributes: ['id', 'name', 'private', 'city', 'state']
                },
                {
                    association: 'Venue',
                    attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
                },
                {
                    association: 'EventImages'
                }
            ]
        });

        if(!event) {
            return res.json({message: "Event couldn't be found"});
        }
    } catch(e){
        return next(e);
    }

    res.json(event);
});

// Edit an event by Id
router.put('/:eventId', async (req, res, next) => {
    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const event = await Event.findByPk(eventId);

    if(venueId) event.venueId = venueId;
    if(name) event.name = name;
    if(type) event.type = type;
    if(capacity) event.capacity = capacity;
    if(price) event.price = price;
    if(description) event.description = description;
    if(startDate) event.startDate = startDate;
    if(endDate) event.endDate = endDate;
    try {
        await event.save();
    } catch (e) {
        return next(e);
    }

    res.json(event);
});

// Delete an Event by Id
router.delete('/:eventId', async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;

    if(!user) {
        res.json({message: 'Event couldn\'t be found'});
    }

    let event;
    try {
        event = await Event.findByPk(eventId);
        if(!event) {
            return res.json({message: 'forbidden'});
        }
    } catch (e) {
        return next(e);
    }

    await event.destroy();
    return res.json({ message: 'Successfully deleted' });
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
    if(name) where.name = { [Op.like]: name};
    if(type) where.type = type;
    if(startDate) where.startDate = startDate;

    const allEvents = await Event.scope(['defaultScope','everything']).findAll({
        include: [
            {
                association: 'Group',
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                association: 'Venue',
                attributes: ['id', 'city', 'state']
            },
            {
                model: User,
                as: 'Attendance',
                through: {
                    atributes: []
                }
            }
        ],
        attributes: {
            exclude: ['capacity', 'price', 'description']
        },
        where,
        limit,
        offset
    });

    return res.json({ Events: allEvents });
});

// Export router
module.exports = router;
