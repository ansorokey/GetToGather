// Router route - /api/groupmembers

const express = require('express');
const { GroupMember } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const gmTable = await GroupMember.findAll();

    res.json(gmTable);
});

// Export router
module.exports = router;
