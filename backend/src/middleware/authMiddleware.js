import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  console.log("TOKEN RECEIVED:", header);

  try {
    const token = header?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};
