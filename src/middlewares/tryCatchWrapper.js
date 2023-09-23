const tryCatchWrapper = controllerFn => async (req, res, next) => {
  try {
    await controllerFn(req, res);
  } catch (error) {
    next(error);
  }
};

module.exports = { tryCatchWrapper };
