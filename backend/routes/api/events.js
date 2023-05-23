const express = require('express');
const { Op } = require('sequelize');
const { Event } = require('../../db/models');
const { query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Add image to an event by Id
router.post('/:eventId/images', async (req, res) => {
    const { eventId } = req.params;
    let { url, preview } = req.body;
    preview = preview === 'true' ? true : false;

    const event = await Event.findByPk(eventId);
    const newEventImage = await event.createEventImage({
        url, preview
    });

    return res.json({
        id: newEventImage.id,
        url, preview
    });
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

// Return all events
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
