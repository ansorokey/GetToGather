const express = require('express');
const sequelize = require('sequelize');

const { Group, User, GroupMember } = require('../../db/models');

const router = express.Router();

//Router route - /api/groups

router.get('/', async (req, res) => {
    const allGroups = await Group.findAll({
        // include: {
        //     model: User
        // },
        // attributes: {
        //     incluide: [[
        //         sequelize.fn('COUNT', sequelize.col('GroupMembers.groupId')),
        //         'numMembers'
        //     ]]
        // }
    });

    res.json(allGroups);
});

// Export router
module.exports = router;
