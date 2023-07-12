const bcrypt = require('bcryptjs');

const firstNames =
`Jack
Sky
Bridge
Z
Syd
Anubis
Kat`;

const lastNames =
`Landors
Tate
Carson
Delgado
Drew
Cruger
Manx`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const spd = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    spd.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { spd };
