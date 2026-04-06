// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// /**
//  * Middleware to verify user JWT token
//  */
// const authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.id;
//     req.userEmail = decoded.email;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
//   }
// };

// /**
//  * Middleware to verify admin JWT token
//  */
// const authenticateAdmin = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
    
//     if (!decoded.isAdmin) {
//       return res.status(403).json({ message: 'Admin access required' });
//     }

//     req.adminId = decoded.id;
//     req.adminUsername = decoded.username;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
//   }
// };

// module.exports = {
//   authenticateUser,
//   authenticateAdmin,
// };
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'superlongrandomstringwithsymbols123!@#changeit';

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach full payload
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Admin access required' });

    req.admin = decoded; // attach full payload
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser, authenticateAdmin };
