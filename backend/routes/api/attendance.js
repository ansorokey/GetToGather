// Router route - /api/attendance

const express = require('express');
const { EventAttendee } = require('../../db/models');

const router = express.Router();

// Get all attendances
// Dev route
router.get('/', async (req, res) => {
    const attendance = await EventAttendee.findAll();

    res.json(attendance);
});

// Export router
module.exports = router;
