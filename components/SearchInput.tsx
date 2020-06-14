import React from "react";
import { TextInput, StyleSheet } from "react-native";
import commonStyles from "../style/common";

const SearchInput = ({ navigation }: any) => {
  return (
    <TextInput
      style={commonStyles.input}
      onFocus={() => navigation.navigate("Root", { screen: "Search" })}
      placeholder="Search"
    />
  );
};

export default SearchInput;
