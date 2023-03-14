export const handleError = (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong";
  return res.status(errStatus).json({
    message: errMessage,
    success: false,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
