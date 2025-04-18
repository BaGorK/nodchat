import "dotenv/config";
import { User } from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/validate-env";

export const generateTokenAndSetCookie = (data: User, res: Response) => {
  const token = jwt.sign({ id: data.id }, env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  res.cookie("accessToken", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // MS,
    httpOnly: true, // prevent XSS cross site scripting
    sameSite: "strict", // CSRF attack cross-site request forgery
    secure: process.env.NODE_ENV !== "development", // HTTPS
  });

  return token;
};

export interface DecodedToken {
  id: string;
}
export const verifyJWT = (token: string): DecodedToken => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  return decoded as DecodedToken;
};
