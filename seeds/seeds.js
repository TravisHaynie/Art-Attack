const sequelize = require('../config/connection.js'); 
const { Subject } = require('../models');

async function seedSub() {
    const subjectData = [
        {
            subject: 'a car on fire',
            submittedBy: 1, 
        },
    ];

    return seedSubjects = await Subject.bulkCreate(subjectData);
}

// Call the seedSub function
(async () => {
    try {
        await sequelize.sync(); // Sync models with the database
        const result = await seedSub();
        console.log('Seed successful:', result);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        sequelize.close(); // Close the database connection
    }
})();