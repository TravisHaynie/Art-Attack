const sequelize = require('sequelize'); // Import your Sequelize instance
const { Subject } = require('../models');

const subjectData = [
    {
        subject: 'Mathematics',
        submittedBy: 1, // Assuming user with id 1 submitted this subject
    },
    {
        subject: 'Science',
        submittedBy: 2, // Assuming user with id 2 submitted this subject
    },
    {
        subject: 'History',
        submittedBy: 3, // Assuming user with id 3 submitted this subject
    },
];

const seedSubjects = async () => {
    try {
        await sequelize.sync(); // Ensure database connection
        await Subject.bulkCreate(subjectData);
        console.log('Subjects seeded successfully.');
    } catch (error) {
        console.error('Error seeding subjects:', error);
    }
};

module.exports = seedSubjects;