import jwt from "jsonwebtoken";
import AuthToken from "../models/token.js";
import Authentication from "../models/Authentication.js";

export const requireAuth = async (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const dbToken = await AuthToken.findOne({
      where: {
        auth_id: decoded.auth_id,
        token,
        is_revoked: false,
      },
    });

    if (!dbToken || new Date(dbToken.expires_at) < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await Authentication.findByPk(decoded.auth_id, {
      attributes: ["auth_id", "user_name", "email"],
    });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
