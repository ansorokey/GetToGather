const express = require('express');
const sequelize = require('sequelize');

const { Group, User, GroupMember } = require('../../db/models');
const group = require('../../db/models/group');

const router = express.Router();

//Router route - /api/groups

router.get('/', async (req, res) => {

    const allGroups = await Group.findAll({
        include: {
            model: User,
            as: 'Members',
            through: {
                attributes: []
            }
        },
        attributes: {
            include: []
        }
    });

    const payload = [];
    for(let i = 0; i < allGroups.length; i++){
        let group = allGroups[i];
        group.numMembers = group.Members.length;
        payload.push(
            group
        );
    }

    res.json({
        Groups: payload
    });
});

// Export router
module.exports = router;
