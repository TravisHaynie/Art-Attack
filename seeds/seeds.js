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

const seedSubjects = () => Subject.bulkCreate(subjectData);

module.exports = seedSubjects;