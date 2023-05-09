const router = require('express').Router();
const { User } = require('../../db/models');
const {
    setTokenCookie,
    restoreUser,
    requireAuth
} = require('../../utils/auth.js');

// -- must be first router middleware --
router.use(restoreUser);

router.get('/', (req, res) => {
    res.json({
        message: 'api/index.js router running'
    });
})

// -- nothing below this line --
module.exports = router;
