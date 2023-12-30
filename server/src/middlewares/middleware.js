const jwt = require('jsonwebtoken');

function authenticate(allowedRoles) {

    return (req, res, next) => {
        let jwtToken;
        const authHeader = req.headers["authorization"];

        if (authHeader !== undefined) {
            jwtToken = authHeader.split(" ")[1];
        }

        if (!jwtToken) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(jwtToken, 'your-secret-key');

            // Check if the user's role is allowed
            if (allowedRoles.includes(decoded.role)) {
                req.user = decoded; // Attach user information to the request object
                next();
            } else {
                // The user's role is not allowed to access this route
                res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }
        } catch (error) {
            // Token verification failed
            res.status(401).json({ message: 'Invalid token.' });
        }
    };
}

module.exports = {
    authenticate
};
