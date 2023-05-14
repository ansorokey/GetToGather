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
            },
        }
    });

    // optional test query to show all members
    const { includeMembers } = req.query;
    let members;

    // I could not for the life of me figure out how to eager load each group's aggregate count
    // I could use instance.count() but this saves some network traffic
    const payload = [];
    for(let i = 0; i < allGroups.length; i++){
        let group = allGroups[i];
        let numMembers = group.Members.length;
        if(includeMembers === 'true') members = group.Members;
        payload.push({
            id: group.id,
            organizerId: group.organizerId,
            name: group.name,
            about: group.about,
            type: group.type,
            private: group.private,
            city: group.city,
            state: group.state,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            numMembers,
            previewImage: group.previewImage,
            members
        });
    }

    res.json({
        Groups: payload
    });
});

// Export router
module.exports = router;
