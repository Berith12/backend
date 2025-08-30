import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    const token = authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT || process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if(err) {
            return res.status(403).json({ message: 'Invalid access token' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;


