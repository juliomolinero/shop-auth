/**
 * 
 * PS C:\molinej\web\Node\shop-categories> npm start
 * > rest-shop@1.0.0 start C:\molinej\web\Node\rest-categories
 * > nodemon server.js
 * 
 * [nodemon] 1.18.5
 * [nodemon] to restart at any time, enter `rs`
 * [nodemon] watching: *.*
 * [nodemon] starting `node server.js`
 * Listening
 * [nodemon] restarting due to changes...
 * [nodemon] starting `node server.js` 
 * 
 * =================================================================================================
 * MongoDB local instance, run deamon as follows:
 * =================================================================================================
 * mongod --dbpath=C:\molinej\Data\MongoDB --logpath=C:\molinej\Data\MongoDB\mongo.log
 * 
 */
// Modules
const express = require('express');
const app = express();
// Parse body requests
const bodyParser = require('body-parser');
// MongoDB connector
const mongoose = require('mongoose');

// Routes
const userRoutes = require('./api/routes/users');

// MongoDB connection string
const mongooseCnnStr = process.env.MONGO_HOST || 'mongodb://localhost:27017';

// Attempt to connect to database
mongoose.connect(mongooseCnnStr,
    {
        useNewUrlParser: true,
        poolSize: 100,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 60000,
        dbName: process.env.MONGO_DATABASE || 'shop-db-users',
        keepAlive: 1,
        autoReconnect: 1
    }
).then(() => {
    console.log("Connected to auth-users database");
}).catch((err) => {
    console.log("Connection error ", err)
});
// Avoid mongoose's deprecation warnings
mongoose.Promise = global.Promise;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST');
        return res.status(200).json({});
    }
    next();
});

// API endpoints
app.use('/auth', userRoutes);

// Error handling
// 404
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
// 500
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Make it visible
module.exports = app;
