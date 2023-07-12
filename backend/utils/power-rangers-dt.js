const bcrypt = require('bcryptjs');

const firstNames =
`Conner
Ethan
Kira
Tommy
Trent`;

const lastNames =
`McKnight
James
Ford
Oliver
Fernandez-Mercer`;

const fnArray = firstNames.split('\n');
const lnArray = lastNames.split('\n');

const dinothunder = [];

for(let i = 0; i < fnArray.length; i++){
    const first = fnArray[i];
    const last = lnArray[i];

    dinothunder.push({
        email: `${first.toLowerCase() + last.toLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last,
        hashedPassword: bcrypt.hashSync('password')
    });
}

module.exports = { dinothunder };
