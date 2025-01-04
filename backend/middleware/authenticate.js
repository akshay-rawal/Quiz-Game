import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    const token = authHeader.split(" ")[1].trim();

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not set in environment variables." });
    }

    try {
        console.log("Verifying token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        req.token = token; // Set the token on the request object

        req.user = decoded
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
