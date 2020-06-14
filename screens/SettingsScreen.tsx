import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface IProps {}

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SETTINGS SCREEN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    margin: 16,
  },
});

export default SettingsScreen;
