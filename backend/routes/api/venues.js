// Router route - /api/venues
const express = require('express');

const { Venue, Group, GroupMember } = require('../../db/models');
const { body } = require('express-validator');
const { requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');

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

const checkForVenue = async (req, res, next) => {
    const venueId = req.params.venueId;

    let venue;
    try {
        venue = await Venue.findByPk(venueId);
        if(!venue) {
            res.status(404);
            return res.json({ message: 'Venue couldn\'t be found'});
        }

        next();
    } catch (e) {
        next(e);
    }
};

const router = express.Router();

// Edit a venue by its id
// ALMOST GOOD
// Change validation middleware into custom functions
router.put('/:venueId', requireAuth, checkForVenue, async (req, res, next) => {
    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    let hasPermission = false;

    const venue = await Venue.findByPk(venueId);
    const group = await Group.findByPk(venue.groupId);

    if(req.user.id === group.organizerId) hasPermission = true;

    if(!hasPermission) {
        try {
            const membership = await GroupMember.findOne({
                where: { memberId: req.user.id, groupId: group.id }
            });

            if(membership && membership.status === 'co-host') hasPermission = true;
        } catch (e) {
            return next(e);
        }
    }

    if( hasPermission ) {
        if(address) venue.address = address;
        if(city) venue.city = city;
        if(state) venue.state = state;
        if(lat) venue.lat = lat;
        if(lng) venue.lng = lng;

        try {
            await venue.save();
            res.json({venue});
        } catch (e) {
            return next(e);
        }
    } else {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }
});

// Get all venues (dev test)
router.get('/', async (req, res) => {
    const venues = await Venue.findAll();

    res.json({venues})
})

// Export router
module.exports = router;
