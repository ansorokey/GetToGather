// Router route - /api/secret/dev

const express = require('express');
const { EventAttendee, GroupMember, Venue, Image } = require('../../db/models');

const router = express.Router();

// Get all attendances
router.get('/attendance', async (req, res, next) => {
    try {
        const attendance = await EventAttendee.findAll();
        res.json(attendance);
    } catch (e) {
        return next(e);
    }
});

// Get all memberships
router.get('/memberships', async (req, res, next) => {
    const memberships = await GroupMember.findAll();

    res.json(memberships);
});

// Get a venue (dev test)
router.get('/venues/:venueId', async (req, res, next) => {
    const venue = await Venue.findByPk(req.params.venueId);

    res.json(venue)
})

// Get all venues (dev test)
router.get('/venues', async (req, res, next) => {
    const venues = await Venue.findAll();

    res.json({venues})
})

// Return all users
// Dev route
router.get('/users', async (req, res, next) => {
    const allUsers = await User.scope(null).findAll({
        // include: [
        //     {
        //         association: 'ownedGroup'
        //     },
        //     {
        //         association: 'memberships'
        //     },
        //     {
        //         association: 'Attending'
        //     }
        // ]
    });
    res.json(allUsers);
});

// Get all images
router.get('/images', async (req, res, next) => {
    const images = await Image.scope(null).findAll();
    res.json({images});
});

// Export router
module.exports = router;
