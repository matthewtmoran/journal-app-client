import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { RobotLightText } from "../components/StyledText";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View>
        <RobotLightText style={styles.message}>
          Welcome To Journal App β
        </RobotLightText>
        <PrimaryButton
          styles={styles.button}
          onPress={() => navigation.navigate("Sign In")}
        >
          Log In
        </PrimaryButton>
        <SecondaryButton
          styles={styles.button}
          onPress={() => navigation.navigate("Sign Up")}
        >
          Register
        </SecondaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
  },
  button: {
    marginVertical: 8,
    width: "100%",
  },
  message: {
    fontSize: 30,
    margin: 20,
  },
});

export default WelcomeScreen;
