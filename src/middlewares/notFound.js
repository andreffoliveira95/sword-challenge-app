const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const notFound = (request, response) => {
  response
    .status(StatusCodes.NOT_FOUND)
    .json({ status: StatusCodes.NOT_FOUND, error: ReasonPhrases.NOT_FOUND });
};

module.exports = notFound;
