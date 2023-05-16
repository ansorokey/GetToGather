//Router route - /api/groups
const express = require('express');

const { Group } = require('../../db/models');

const router = express.Router();

// Return a specific group
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    const group = await Group.findByPk(groupId);

    res.json({ group });
})

// Return all groups
router.get('/', async (req, res) => {

    const allGroups = await Group.findAll();

    res.json({
        Groups: allGroups
    });
});

// Export router
module.exports = router;
