const { sequelize } = require('./db/models');

sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA);
  }
});

// Checks to see if the schema defined in the .env is in the database
// creates a new schema if not
// SQL equivilent to 'CREATE SCHEMA IF NOT EXISTS <your-schema-name>;'
