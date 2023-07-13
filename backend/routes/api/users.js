// Router Route - /api/users
const express = require('express');
const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { User, Group, GroupMember, Event } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation.js');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');

const router = express.Router();

// Validate User input for sign up
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    handleValidationErrors
];

// Check db for existing email or username
const alreadyExists = async (req, res, next) => {
    const { email, username } = req.body;

    const err = new Error('User already exists');
    err.errors = {};
    err.status = 500;
    err.title = 'User already exists';

    const existingEmail = await User.findOne({
        where: {
            email
        }
    });

    if(existingEmail) err.errors.email = 'User with that email already exists';

    const existingUsername = await User.findOne({
        where: {
            username
        }
    });

    if(existingUsername) err.errors.username = 'User with that username already exists';

    if(err.errors.email || err.errors.username) return next(err);

    next();
}

// #Sign up a new user
router.post('/', validateSignup, alreadyExists, async (req, res, next) => {
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

    return res.json(
        safeUser
    );
});

// #Get all Groups joined or organized by the Current User
router.get('/current/groups', requireAuth, async (req, res, next) => {

    // Query the join table to see where user is a member
    const joinedGroups = await GroupMember.findAll({
        where: {
            memberId: req.user.id
        },
        //Only need the id of the group they are a member in
        attributes: ['groupId']
    });

    // an array of groupIds user belongs to
    const groupArr = joinedGroups.map(el => el.groupId);

    //get all groups they organized and are a member of
    // CHANGED SCOPE FROM MEMBERS TO NULL TO GET NUM EVENTS
    const groups = await Group.scope(null).findAll({
        where: {
            [Op.or]: [ { organizerId: req.user.id }, { id: groupArr } ]
        },
        include: {
            model: Event
        }
    });

    // Parse numMembers into an integer -- shows up as a string otherwise on Render
    for(let i = 0; i < groups.length; i++){
        groups[i].dataValues.numMembers = Number.parseInt(groups[i].dataValues.numMembers);
    }

    res.json({
        Groups: groups
    });
});

// Export Router
module.exports = router;
