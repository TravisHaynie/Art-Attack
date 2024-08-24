const sequelize = require('sequelize');
const seedSubjects = require('./seed');

const db = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});

const seedDatabase = async () => {
    try {
        await db.authenticate();
        await seedSubjects();
        console.log('Data seeded into the Subject table successfully!');
    } catch (error) {
        console.error('Error seeding data into the Subject table:', error);
    } finally {
        await db.close(); // Close the database connection
    }
};

seedDatabase();