const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING_URL, {
            dbName: 'e-cormerce-api'
        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = connectToDatabase;