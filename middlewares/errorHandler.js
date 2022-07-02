module.exports = (err, _, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: 'Oooops! Server Error:(' });
  return next();
};
