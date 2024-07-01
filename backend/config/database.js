const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/config/config.env' });

exports.connectDatabase = () => {
    mongoose
        .connect(process.env.MONGO_URI, )
        .then((con) => {
            console.log(`Database connected: ${con.connection.host}`);
        })
        .catch(err => console.log(err));
};

