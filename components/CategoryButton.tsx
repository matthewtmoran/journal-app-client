import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import { RobotLightText } from "./StyledText";

interface IProps {
  category: ICategory;
}

const CategoryButton = ({ category }: IProps) => {
  return (
    <View
      style={{
        backgroundColor: category.color,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 8,
        minWidth: 75,
      }}
    >
      <RobotLightText style={styles.text}>{category.name}</RobotLightText>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 16,
    width: "auto",
    textAlign: "center",
  },
});

export default CategoryButton;
