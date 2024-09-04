import { CognitoJwtVerifier } from "aws-jwt-verify";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_USER_POOL_ID: string;
      AWS_USER_POOL_APP_CLIENT: string;
    }
  }
}

// All users - verify that the access token is valid
const allUsersVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.AWS_USER_POOL_APP_CLIENT,
  groups: ["StaffMember", "Manager"],
});

// Managers - verify that the access token is valid and belongs to a manager
const managersVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.AWS_USER_POOL_APP_CLIENT,
  groups: ["Manager"],
});

// Middleware function to verify a staff member jwt
export const authenticateAllUsersToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorisationHeader = req.headers.authorization;

  // Get token from auth header.
  const token = authorisationHeader && authorisationHeader.split(" ")[1];

  // If no token found return unauthorised status
  if (!token) return res.status(401).json({ message: "User not authorised", statusCode: 401 });

  try {
    // Verify token
    await allUsersVerifier.verify(token);

    // Execute next middleware once user verified
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Authentication failed", statusCode: 403 });
  }
};

// Middleware function to verify a staff member jwt
export const authenticateManagerToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorisationHeader = req.headers.authorization;

  // Get token from auth header.
  const token = authorisationHeader && authorisationHeader.split(" ")[1];

  // If no token found return unauthorised status
  if (!token) return res.status(401).json({ message: "User not authorised", statusCode: 401 });

  try {
    // Verify token
    await managersVerifier.verify(token);

    // Execute next middleware once user verified
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Authentication failed", statusCode: 403 });
  }
};
