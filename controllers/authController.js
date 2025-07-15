const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { 
                error: 'Invalid username or password'
            });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        // Redirect based on role
        if (user.role === 'student') {
            res.redirect('/registration/list');
        } else if (user.role === 'admin') {
            res.redirect('/event/list');
        } else {
            res.redirect('/auth/login');
        }
        
    } catch (error) {
        res.render('login', { 
            error: 'An error occurred during login'
        });
    }
};