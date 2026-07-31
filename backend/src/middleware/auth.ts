import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_stockwallah_secret";

export type AdminJwtPayload = {
  id: number;
  email: string;
  name: string;
};

export function signAdminToken(payload: AdminJwtPayload) {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : undefined;
  const token = req.cookies?.admin_token || bearer;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    (req as Request & { admin: AdminJwtPayload }).admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
