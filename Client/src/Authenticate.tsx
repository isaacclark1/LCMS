import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App";
import components from "./sign-in/components";

const Authenticate: React.FC = () => (
  <Authenticator hideSignUp components={components}>
    <App />
  </Authenticator>
);

export default Authenticate;
