import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return; // Return here to indicate the end of the middleware
  }

  jwt.verify(token, process.env.JWT_KEY as string, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
      return; // Return here to indicate the end of the middleware
    }
    // Attach the decoded payload to the request object
    req.username = (decoded as JwtPayload).username;
    next();
  });
}
