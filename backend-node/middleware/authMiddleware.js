import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sparepart_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}

export function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ error: "Access denied" });
    next();
  };
}