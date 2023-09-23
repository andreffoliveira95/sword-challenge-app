const tryCatchWrapper = (controllerFn) => {
  return async (request, response, next) => {
    try {
      await controllerFn(request, response);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = tryCatchWrapper;
