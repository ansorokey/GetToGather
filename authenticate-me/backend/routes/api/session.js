const express = require('express');
const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');
const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true})
        .withMessage('Please provide a password.'),
    handleValidationErrors
]

// Router route - /api/session

// Restore session user (Log in automatically)
// The restoreUser middleware creates a user property on the req
// The req.user property is accessible in further middleware
router.get('/', async (req, res) => {
    const { user } = req;
    if(user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username
        };
        return res.json({
            user: safeUser
        });
    } else {
        return res.json({ user: null});
    }
});

//Logging in
// Post method requires a valid body
// ValidateLogin runs middleware to make sure the following values exist are not empty
router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    //find user with all attributes included
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    //No user found OR password doesnt match
    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login Failed';
        err.errors = { credential: 'The provided credentials were invalid.' }
        return next(err);
    }

    //Return an object that doesnt include user's sensitive information
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
});

// Logging out
router.delete('/', async (_req, res) => {
    // deletes 'token' cookie from browser
    res.clearCookie('token');
    return res.json({
        message: 'success'
    });
});

// -- nothing below this line --
module.exports = router;
