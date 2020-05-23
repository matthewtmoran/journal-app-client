import React, { FunctionComponent } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RobotLightText } from "./StyledText";

interface IPrimaryButton {
  styles?: { [key: string]: string | number };
  textStyling?: { [key: string]: string | number };
  isDisabled?: boolean;
  onPress: () => void;
}

const PrimaryButton: FunctionComponent<IPrimaryButton> = ({
  children,
  isDisabled,
  onPress,
  ...rest
}) => {
  const handleOnPress = () => {
    if (isDisabled) {
      return;
    }
    return onPress();
  };
  console.log({ isDisabled });
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View
        style={{
          ...styles.button,
          ...rest.styles,
          ...(isDisabled ? styles.disabled : {}),
        }}
      >
        <RobotLightText style={{ ...styles.buttonText, ...rest.textStyling }}>
          {children}
        </RobotLightText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#144568",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "auto",
  },
  disabled: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});

export default PrimaryButton;
