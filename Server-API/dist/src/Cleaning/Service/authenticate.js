"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateManagerToken = exports.authenticateAllUsersToken = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// All users - verify that the access token is valid
const allUsersVerifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.AWS_USER_POOL_APP_CLIENT,
    groups: ["StaffMember", "Manager"],
});
// Managers - verify that the access token is valid and belongs to a manager
const managersVerifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.AWS_USER_POOL_APP_CLIENT,
    groups: ["Manager"],
});
// Middleware function to verify a staff member jwt
const authenticateAllUsersToken = async (req, res, next) => {
    const authorisationHeader = req.headers.authorization;
    // Get token from auth header.
    const token = authorisationHeader && authorisationHeader.split(" ")[1];
    // If no token found return unauthorised status
    if (!token)
        return res.status(401).json({ message: "User not authorised", statusCode: 401 });
    try {
        // Verify token
        await allUsersVerifier.verify(token);
        // Execute next middleware once user verified
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Authentication failed", statusCode: 403 });
    }
};
exports.authenticateAllUsersToken = authenticateAllUsersToken;
// Middleware function to verify a staff member jwt
const authenticateManagerToken = async (req, res, next) => {
    const authorisationHeader = req.headers.authorization;
    // Get token from auth header.
    const token = authorisationHeader && authorisationHeader.split(" ")[1];
    // If no token found return unauthorised status
    if (!token)
        return res.status(401).json({ message: "User not authorised", statusCode: 401 });
    try {
        // Verify token
        await managersVerifier.verify(token);
        // Execute next middleware once user verified
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Authentication failed", statusCode: 403 });
    }
};
exports.authenticateManagerToken = authenticateManagerToken;
