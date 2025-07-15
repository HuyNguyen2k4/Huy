const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
    }
};

exports.requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.render('error', { 
            error: 'Access denied. You do not have permission to view this page.' 
        });
    }
    next();
};