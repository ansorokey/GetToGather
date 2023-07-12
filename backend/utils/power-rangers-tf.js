const bcrypt = require('bcryptjs');

const firstNames =
`Wesley
Jen
Lucas
Katie
Trip
Eric
Circuit`;

const lastNames =
`Collins
Scotts
Kendall
Walker
Green
Myers
Owl`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const timeforce = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    timeforce.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { timeforce };
