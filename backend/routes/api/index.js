// Import Routers
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const eventsRouter = require('./events.js');
const venuesRouter = require('./venues.js');

// Import Authentication Helper Function
const { restoreUser } = require('../../utils/auth.js');

// Connect Middleware
// -- restoreUser must be first router middleware --
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/events', eventsRouter);
router.use('/venues', venuesRouter);

// Test the /api post route
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

// Export Router
module.exports = router;
