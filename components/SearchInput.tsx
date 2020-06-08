import React from "react";
import { StyleSheet, TextInput, View, Button } from "react-native";
import commonStyles from "../style/common";

const SearchInput = ({ navigation }: any) => {
  return (
    <View>
      <TextInput
        onFocus={() => navigation.navigate("Root", { screen: "Search" })}
        style={commonStyles.input}
        placeholder="Search"
      ></TextInput>
    </View>
  );
};

export default SearchInput;
