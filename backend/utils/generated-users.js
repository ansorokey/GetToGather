const firstNames = `Demo
Victory
Maricella
Vyom
Janice
Emil
Reid
Davontae
Vaeda
Ibrahima
Jahmari
Emmit
Aiko
Chester
Graycen
Jethro
Peyton
Jazlin
Batoul
Tommie
Reanna
Tayler
Keagen
Leigh
Kenai
Ryker
Evelina
Elyana
Ethan
Emmersyn
Vansh
Averly
Eddison
Mikhael
Ravi
Reyli
Lilah
Johana
Neil
Taelyn
Aden
Ina
Laine
Jaxson
Cienna
Kloee
Rhiley
Kolt
Elyas
Safiyyah
Tennyson`

const firstNamesArray = firstNames.split('\n');

const lastNames = `User
Killeen
Davis
Larose
Adamski
Rivas
Bigham
Kwiatkowski
Martinson
Didonato
Ebel
Hinckley
Carpio
Stamm
Bradley
Duffield
Stinson
Cipriano
Sickles
Jolley
Cruise
Osullivan
Cress
Bledsoe
Adams
Stambaugh
Sandy
Ratcliffe
Findlay
Campo
Gilliam
Rector
Stancil
Arambula
Yingling
Desmond
Serrano
Avila
Kissinger
Chiang
Medlock
Press
Brisco
Stith
Cadena
Adorno
Coston
Saavedra
Horan
Lentz
Antoine`

const lastNamesArray = lastNames.split('\n');

const users = [];

for(let i = 0; i < firstNamesArray.length; i++){
    const first = firstNamesArray[i];
    const last = lastNamesArray[i];

    users.push({
        email: `${first.toLocaleLowerCase() + last.toLocaleLowerCase()}@email.com`,
        username: `${first.toLowerCase() + last.toLowerCase()}`,
        firstName: first,
        lastName: last
    });
}

module.exports = { users };
