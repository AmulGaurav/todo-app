require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const SECRET: string = process.env.JWT_SECRET!;

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err || !user || typeof user === "string") {
        return res.sendStatus(403);
      }

      req.headers["userId"] = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
