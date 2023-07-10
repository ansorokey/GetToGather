const bcrypt = require('bcryptjs');

const firstNames =
`Scott
Flynn
Summer
Ziggy
Dillon
Gem
Gemma
Doctor`;

const lastNames =
`Truman
McAllistair
Landsdown
Grover
Black
Gold
Silver
K`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const rpm = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    rpm.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { rpm };
