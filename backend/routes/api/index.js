// Import Routers
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');

// Import Database Models
const { User } = require('../../db/models');

// Import Authentication Helper Functions
const {
    setTokenCookie,
    restoreUser,
    requireAuth
} = require('../../utils/auth.js');

// Connect Middleware
// -- must be first router middleware --
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);

// Posts
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

// Export Router
module.exports = router;
