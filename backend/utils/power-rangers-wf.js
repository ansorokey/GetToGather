const bcrypt = require('bcryptjs');

const firstNames =
`Cole
Taylor
Max
Danny
Alyssa
Merrick
Princess`;

const lastNames =
`Evans
Earhardt
Cooper
Delgado
Enrile
Baliton
Shayla`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const wildforce = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    wildforce.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { wildforce };
