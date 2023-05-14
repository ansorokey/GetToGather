const groups = [];

for(let i = 1; i <= 10; i++){
    groups.push({
        name: 'Group Number ' + i,
        about: `This is group number ${i} and lorem ipsum hakuna mattatta timon and pumba you get the jist.`,
        type: 'In person',
        private: true,
        city: 'Internetville',
        state: 'Internetland'
    });
}

module.exports = { groups };
