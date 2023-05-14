const express = require('express');

const { Group, User } = require('../../db/models');

const router = express.Router();

//Router route - /api/groups

router.get('/', async (req, res) => {
    const allGroups = await Group.findAll();

    res.json(allGroups);
});

// Export router
module.exports = router;
