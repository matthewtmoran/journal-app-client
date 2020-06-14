import React from "react";
import { View, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import CategoryPill from "./CategoryPill";
import { FontAwesome } from "@expo/vector-icons";

interface IProps {
  categories: ICategory[];
  isAddButton?: boolean;
  onPress?: (category: ICategory) => void;
}

const CategoryList = ({ categories, onPress, isAddButton }: IProps) => {
  return (
    <View style={styles.container}>
      {categories.map(({ id, name, color }, index) => {
        if (!onPress) {
          return <CategoryPill key={index} category={{ id, name, color }} />;
        }
        return (
          <CategoryPill
            category={{ id, name, color }}
            onPress={() => onPress({ id, name, color })}
            key={index}
          >
            <FontAwesome
              name={isAddButton ? "plus" : "minus"}
              size={16}
              color="#fff"
            />
          </CategoryPill>
        );
      })}
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

export default CategoryList;
