// Import Routers
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const groupMembersRouter = require('./groupmembers.js');
const eventsRouter = require('./events.js');

// Import Database Models
const { User } = require('../../db/models');

// Import Authentication Helper Function
const { restoreUser } = require('../../utils/auth.js');

// Connect Middleware
// -- must be first router middleware --
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/groupmembers', groupMembersRouter);
router.use('/events', eventsRouter);

// Posts
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

// Export Router
module.exports = router;
