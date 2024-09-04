import { useTheme, View, Image } from "@aws-amplify/ui-react";
import logo from "../assets/DLC-logo-white-no-background.png";

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image alt="The Dolphin Leisure Centre Logo" src={logo} />
      </View>
    );
  },
};

export default components;
