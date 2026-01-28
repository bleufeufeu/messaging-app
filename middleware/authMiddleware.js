const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader === 'undefined') {
        return res.status(401).json({ error: "No access token" });
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    if (!bearerToken) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    jwt.verify(bearerToken, process.env.JWT_SECRETKEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;