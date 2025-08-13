const errorHandler = (err, req, res, next) => { 
  console.error(err);
  res.status(500).json({
    error: 'internal_error',
    message: process.env.NODE_ENV === 'development' ? String(err?.message || err) : undefined,
  });
};

export { errorHandler };      
export default errorHandler;