import { UserDetails } from "../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
export interface AuthenticatedRequest extends Request {
  user?: UserDetails;
}

export default async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  //check the header
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new BadRequestError("Authentication Invalid");
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      user: UserDetails;
    };
    req.user = payload.user;
    next();
  } catch (e) {
    next(e);
  }
}
