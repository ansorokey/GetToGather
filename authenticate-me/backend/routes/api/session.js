const express = require('express');
const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');
const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = express.Router();

// Router route - /api/session

// TEST GET
router.get('/', async (req, res) => {
    const allUsers = await User.findAll({
        attributes: {
            include: ['hashedPassword', 'email']
        }
    });

    res.json(allUsers);
});

//Logging in
router.post('/', async (req, res, next) => {
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
