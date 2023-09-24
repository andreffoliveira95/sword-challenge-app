const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (passwordToCompare, storedPassword) => {
  return await bcrypt.compare(passwordToCompare, storedPassword);
};

const generateJWT = (user) => {
  return jwt.sign(
    {
      userID: user.user_id,
      username: user.username,
      roleName: user.role_name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES
    }
  );
};

module.exports = { encryptPassword, comparePassword, generateJWT };
