const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const messages = error.errors.map((e) => e.message).join(', ');
      return next(new AppError(`Validation Error: ${messages}`, 400));
    }
    next(error);
  }
};

module.exports = validate;
