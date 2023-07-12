const bcrypt = require('bcryptjs');

const firstNames =
`Carter
Chad
Joel
Kelsey
Dana
Ryan
Captain
Angela`;

const lastNames =
`Grayson
Lee
Rawlings
Winslow
Mitchell
Mitchell
Mitchell
Fairweather`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const lightspeed = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    lightspeed.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { lightspeed };
