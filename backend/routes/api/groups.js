//Router route - /api/groups
const express = require('express');

const { Group, User, Image, Venue, sequelize } = require('../../db/models');

const router = express.Router();

// Add an image to a group by Id
router.post('/:groupId/images', async (req, res) => {
    const { groupId }  = req.params;
    let { url, preview } = req.body;
    preview = preview === 'true' ? true : false;

    const group = await Group.findByPk(groupId);

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
router.get('/:groupId/venues', async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.scope('venues').findByPk(groupId);
    res.json({ venues: group.Venues });
});

// Create a venue for a group
router.post('/:groupId/venues', async (req, res) => {
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    const group = await Group.findByPk(groupId);

    const newVenue = await group.createVenue({
        address, city, state,
        lat, long: lng
    });

    res.json(newVenue);
});

// Return a specific group
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.unscoped().findByPk(groupId, {
        include: [
            {
                association: 'members',
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
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'long']
            }
        ],
        attributes: {
            include: [
                [
                    sequelize.fn("COUNT", sequelize.col("members.id")),
                    "numMembers"
                ],
            ]
        },
        group: [sequelize.col('Group.id')]
    });

    res.json({ group });
});

// Edit a group by Id
router.put('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body;

    const group = await Group.findByPk(groupId);
    if(name) group.name = name;
    if(about) group.about = about;
    if(type) group.type = type;
    if(private) group.private = private;
    if(city) group.city = city;
    if(state) group.state = state;
    try {
        //the validate method doesnt work the way I thought it did
        //crashes the server, valiadtion errors are returned without it
        //group.validate();
        await group.save();
    } catch (e) {
        return next(e);
    }

    res.json(group);
});

// Delete a group
router.delete('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    // Check if there is a user logged in
    if(!user) {
        res.status(401);
        return res.json({ message: 'Authentication required'});
    }

    // Look for group
    let group;
    try {
        group = await Group.findByPk(groupId);
        if(!group) {
            res.status(404);
            return res.json({ message: 'Group couldn\'t be found'});
        }
    } catch (e) {
        return next(e);
    }

    // Check if current user owns the group
    if(user.id !== group.organizerId) {
        res.status(403);
        return res.json({ message: 'Forbidden'});
    }

    await group.destroy();
    res.json({
        message: 'Successfully deleted'
    });

});

// Return all groups
router.get('/', async (req, res) => {

    const allGroups = await Group.findAll();

    res.json({
        Groups: allGroups
    });
});

// Create a new group
router.post('/', async (req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const { name, about, type, private, city, state, previewImage } = req.body;

    const newGroup = await user.createOwnedGroup({
        name, about, type,
        private, city, state, previewImage
    });

    res.json({
        newGroup
    })
});

// Export router
module.exports = router;
