import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Access token missing or invalid." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "default_jwt_secret_key_32_characters";

  try {
    const decoded = jwt.verify(token, secret) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Token expired or unauthorized." });
    return;
  }
}
