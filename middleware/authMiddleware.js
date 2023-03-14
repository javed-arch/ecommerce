import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        jwt.verify(token, process.env.jwtToken, (err, user) => {
          if (err) return;
          req.user = user;
          next();
        });
      } else {
        return res.status(401).json({
          message: "You are not authenticated",
          success: false,
          data: [],
        });
      }
    } else {
      return res.status(401).json({
        message: "You are not authenticated",
        success: false,
        data: [],
      });
    }
  } catch (err) {
    next(err);
  }
};

export const verifyUser = async (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.params.id === req.user.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({
          message: "You are not authenticated",
          success: false,
          data: [],
        });
    }
  });
};

export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({
          message: "You are not authenticated",
          success: false,
          data: [],
        });
    }
  });
};
