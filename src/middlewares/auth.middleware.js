import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function verifyToken(req, res, next) {
  try {
    console.log(req.cookies);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: true,
        type: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      type: "UNAUTHORIZED",
      // message: "Invalid or expired token",
      //  error: true,
      message: err.message,
    });
  }
}
