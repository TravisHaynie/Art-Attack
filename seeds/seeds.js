const sequelize = require('../config/connection.js'); 
const { Subject } = require('../models');

async function seedSub() {
const subjectData = [
    {
        subject: 'History',
        submittedBy: 1, 
    },
];

 
return seedSubjects = await Subject.bulkCreate(subjectData);

};



module.exports = seedSub;