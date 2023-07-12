const bcrypt = require('bcryptjs');

const firstNames =
`Shane
Tori
Dustin
Hunter
Blake
Cameron
Sensei`;

const lastNames =
`Clarke
Hanson
Brooks
Bradley
Bradley
Watanabe
Watanabe`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const ninjastorm = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    ninjastorm.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { ninjastorm };
