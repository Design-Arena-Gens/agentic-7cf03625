export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const details = err.details || undefined;

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('Unhandled error', err);
  }

  res.status(status).json({
    message,
    details,
  });

  next();
}
