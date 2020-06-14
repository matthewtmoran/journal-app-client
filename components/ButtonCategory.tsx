import React from "react";
import { View, StyleSheet } from "react-native";

function ButtonCategory({ isLastOption, children }: any) {
  return (
    <View style={[styles.option, isLastOption && styles.lastOption]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
export default ButtonCategory;
