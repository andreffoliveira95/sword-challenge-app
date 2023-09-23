const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const authenticate = (request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication invalid.');
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Authentication invalid.');
  }
};

module.exports = authenticate;
