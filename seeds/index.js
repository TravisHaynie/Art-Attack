const sequelize = require('../config/connection'); // Import your Sequelize instance
const seedSubjects = require('./seeds');

const seed = async () => {
    try {
        await sequelize.sync(); // Ensure database connection
        await seedSubjects(); // Seed subjects data
        console.log('Seed process completed successfully.');
        process.exit(0); // Exit the script after seeding
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1); // Exit the script with an error status
    }
};

seed();