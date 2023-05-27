// Router route - /api/secret/dev

const express = require('express');
const { EventAttendee, GroupMember, Venue, Image, User } = require('../../db/models');

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
    try {
        const memberships = await GroupMember.findAll();
        res.json(memberships);
    } catch (e) {
        return next(e);
    }
});

// Get a venue (dev test)
router.get('/venues/:venueId', async (req, res, next) => {
    try {
        const venue = await Venue.findByPk(req.params.venueId);
        res.json(venue);
    } catch (e) {
        return next(e);
    }
})

// Get all venues (dev test)
router.get('/venues', async (req, res, next) => {
    try {
        const venues = await Venue.findAll();
        res.json({venues});
    } catch (e) {
        return next(e);
    }
})

// Return all users
router.get('/users', async (req, res, next) => {
    try {
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
    } catch (e) {
        return next(e);
    }
});

// Get all images
router.get('/images', async (req, res, next) => {
    try {
        const images = await Image.scope(null).findAll();
        res.json({images});
    } catch (e) {
        return next(e);
    }
});

// Export router
module.exports = router;
