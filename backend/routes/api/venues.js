// Router route - /api/venues
const express = require('express');

const { requireAuth } = require('../../utils/auth.js');
const { Venue, Group, GroupMember } = require('../../db/models');

const router = express.Router();

// #Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async (req, res, next) => {
    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    let hasPermission = false;

    try {
        const venue = await Venue.findByPk(venueId);
        if(!venue){
            res.status(404);
            return res.json({ message: 'Venue couldn\'t be found'});
        }

        const group = await Group.findByPk(venue.groupId);
        if(!group){
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }

        if(req.user.id === group.organizerId) hasPermission = true;

        if(!hasPermission) {
            const membership = await GroupMember.findOne({
                where: { memberId: req.user.id, groupId: group.id }
            });

            if(membership && membership.status === 'co-host') hasPermission = true;
        }

        if( hasPermission ) {
            if(address) venue.address = address;
            if(city) venue.city = city;
            if(state) venue.state = state;
            if(lat) venue.lat = lat;
            if(lng) venue.lng = lng;

                await venue.save();
                res.json(venue);
        } else {
            res.status(403);
            return res.json({ message: 'Forbidden'});
        }

    } catch (e) {
        return next(e);
    }
});


// Export router
module.exports = router;
