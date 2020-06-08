import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { RobotThinText } from "./StyledText";

export default class App extends Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <RobotThinText style={styles.titleText}>Journal App</RobotThinText>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  horizontal: {
    padding: 10,
  },
  titleText: {
    fontSize: 40,
    textAlign: "center",
    color: "#333",
  },
});
