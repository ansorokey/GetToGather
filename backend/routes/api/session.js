// Router route - /api/session
const express = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../../db/models');
const { check } = require('express-validator');
const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const { Op } = require('sequelize');

const router = express.Router();

// Validate login credentials
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true})
        .withMessage('Password is required'),
    handleValidationErrors
]

// #Get the Current User
router.get('/', async (req, res, next) => {
    const { user } = req;
    if(user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        };
        return res.json({
            user: safeUser
        });
    } else {
        return res.json({ user: null});
    }
});

// #Log In a User
router.post('/', validateLogin, async (req, res, next) => {
    let { credential, password } = req.body;
    credential = credential.toLowerCase();

    //find user with all attributes included
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: [{email: credential}, {username: credential}]
        }
    });

    //No user found OR password doesnt match
    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login Failed';
        err.errors = { message: 'Invalid credentials' }
        return next(err);
    }

    //Return an object that doesnt include user's sensitive information
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };

    setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
});

// Logging out
router.delete('/', async (_req, res, next) => {
    // deletes 'token' cookie from browser
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

// -- nothing below this line --
module.exports = router;
