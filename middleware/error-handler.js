const errorHandleMiddleware = (err, req, res, next) => {
  return res.status(req.status).json({ msg: req.message });
};

module.exports = errorHandleMiddleware;
