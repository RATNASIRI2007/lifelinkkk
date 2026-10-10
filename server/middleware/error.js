exports.asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join('. ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
  if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' });
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server' });
};
