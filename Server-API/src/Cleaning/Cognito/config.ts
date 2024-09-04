import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_GET_STAFF_MEMBERS_ACCESS_KEY_ID: string;
      AWS_GET_STAFF_MEMBERS_SECRET_ACCESS_KEY_ID: string;
      AWS_REGION: string;
    }
  }
}

export const cognitoReadOnlyClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_GET_STAFF_MEMBERS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_GET_STAFF_MEMBERS_SECRET_ACCESS_KEY_ID,
  },
});
