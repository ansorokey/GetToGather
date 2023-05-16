// Router Route - /api/users
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Group, GroupMember } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { Op } = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    handleValidationErrors
];

// Sign up a new user
// Validate signUp is an array of middleware
// Will catch if any value is falsy or not of proper length
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName
    });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }

    setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

//Get all groups organized by or joined by current user
// REQUIRES AUTHENTICATION
router.get('/current/groups', async (req, res) => {
    const { user } = req;
    if(!user) res.json({message: 'Forbidden'});

    const userId = user.id;

    // Query the join table to see where user is a member
    const joinedGroups = await GroupMember.findAll({
        where: {
            memberId: userId
        },
        //Only need the id of the group they are a member in
        attributes: ['groupId']
    });

    // an array of groupIds user belongs to
    const groupArr = joinedGroups.map(el => el.groupId);

    //get all groups they organized and are a member of
    const groups = await Group.findAll({
        where: {
            [Op.or]: [ { organizerId: userId }, { id: groupArr } ]
        }
    });

    res.json({
        groups
    });
});

router.get('/', async (req, res) => {
    const allUsers = await User.findAll();
    res.json(allUsers);
});

// Export Router
module.exports = router;
