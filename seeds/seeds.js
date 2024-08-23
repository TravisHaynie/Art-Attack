const sequelize = require('sequelize'); 
const { Subject } = require('../models');

const subjectData = [
    {
        subject: 'Mathematics',
        submittedBy: 1, 
    },
    {
        subject: 'Science',
        submittedBy: 2, 
    },
    {
        subject: 'History',
        submittedBy: 3, 
    },
];


seedSubjects = await Subject.bulkCreate(subjectData);



module.exports = seedSubjects;