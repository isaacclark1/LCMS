"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoReadOnlyClient = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.cognitoReadOnlyClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_GET_STAFF_MEMBERS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_GET_STAFF_MEMBERS_SECRET_ACCESS_KEY_ID,
    },
});
