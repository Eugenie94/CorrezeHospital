const mongoose = require('mongoose');
const db = process.env.ATLAS_URL;

const connectDb = async () => {
    try {
        mongoose.get('strictQuery', true);
        await mongoose.connect(db);
        
        console.log("Mongodb a l'ecoute");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDb;