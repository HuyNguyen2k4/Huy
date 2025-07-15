require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Fix views path

// Import routes
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Use routes with error handling
if (authRoutes) app.use('/auth', authRoutes);
if (registrationRoutes) app.use('/registration', registrationRoutes);
if (eventRoutes) app.use('/event', eventRoutes);

// Logger middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Fobbiden');
});

// Connect to database
db();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/auth/login`);
});

module.exports = app;