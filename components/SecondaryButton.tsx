import React, { FunctionComponent } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RobotLightText } from "./StyledText";

interface ISecondaryButton {
  styles?: { [key: string]: string | number };
  textStyling?: { [key: string]: string | number };
  onPress: () => void;
}

const SecondaryButton: FunctionComponent<ISecondaryButton> = ({
  children,
  onPress,
  ...rest
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ ...styles.button, ...rest.styles }}>
        <RobotLightText style={{ ...styles.buttonText, ...rest.textStyling }}>
          {children}
        </RobotLightText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: 120,
  },
  buttonText: {
    textAlign: "center",
    color: "#144568",
    fontSize: 18,
  },
});

export default SecondaryButton;
