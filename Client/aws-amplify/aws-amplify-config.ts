import { ResourcesConfig } from "aws-amplify";

const amplifyconfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: "",
      userPoolClientId: "",
      identityPoolId: "",
      loginWith: {
        username: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

export default amplifyconfig;
