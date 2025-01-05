import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    // Check if the user is a guest (you can adjust this logic based on how you identify guests)
    const isGuestUser = req.headers['x-guest'] === 'true';  // Look for 'x-guest' header sent by frontend

    if (isGuestUser) {
        req.userId = 'guest'; // Set userId as 'guest' for guest users
        return next(); // Proceed with the request
    }

    const authHeader = req.header("Authorization");

    // If there is no Authorization header or if it doesn't contain a valid Bearer token, return 401
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    const token = authHeader.split(" ")[1].trim();

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not set in environment variables." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.token = token; // Set the token on the request object
        req.user = decoded; // Attach decoded user data to the request object
        req.userId = decoded.userId; // Attach userId to the request object

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }

        return res.status(500).json({ message: "An error occurred while verifying the token.", error: err.message });
    }
};

export default authenticate;
