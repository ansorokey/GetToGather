const router = require('express').Router();

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

// -- nothing below this line --
module.exports = router;
