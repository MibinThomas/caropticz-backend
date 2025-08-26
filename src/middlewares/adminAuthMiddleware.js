import jwt from 'jsonwebtoken';
import config from '../config/env.js';

// const adminAuth = async (req, res, next) => {
//     const token = req.headers['authorization'].split(' ')[1];
//     try {
//         if(token){
//             const jwtResponse = jwt.verify(token, config.JWT_ADMIN_SECRET_KEY);
//             req.admin = jwtResponse.userId
//             next();
//         }else{
//             return res.status(401).json({message: "Please Provide Token !!!"})
//         }
//     } catch (error) {
//         return res.status(401).json({ message: "Please Provide Token !!!" });
//     }
// }

// export default adminAuth


const userAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Please Provide Token !!!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const jwtResponse = jwt.verify(token, config.JWT_ADMIN_SECRET_KEY);
        req.user = jwtResponse.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or Expired Token !!!" });
    }
}

export default userAuth;
