// Router route - /api/images

const express = require('express');
const { Image } = require('../../db/models');

const router = express.Router();

// Get all images
// Dev route
router.get('/', async (req, res) => {
    const images = await Image.scope(null).findAll();
    res.json({images});
});

// Export router
module.exports = router;
