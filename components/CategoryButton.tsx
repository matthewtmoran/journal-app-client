import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import { RobotLightText } from "./StyledText";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {
  category: ICategory;
  onPress?: () => void;
}

const CategoryButton = ({ category, onPress }: IProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: category.color,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 8,
        marginVertical: 4,
        minWidth: 75,
      }}
      onPress={onPress}
    >
      <RobotLightText style={styles.text}>{category.name}</RobotLightText>
    </TouchableOpacity>
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
