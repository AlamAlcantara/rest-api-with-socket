if(process.env.NODE_ENV === 'development') {
    const dotenv = require('dotenv');
    dotenv.config();
}

module.exports = {
    MONGODB_URI : process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT
}