const mongoose = require('mongoose');
require("dotenv").config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDb;