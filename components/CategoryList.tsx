import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import CategoryButton from "./CategoryButton";
import { FontAwesome } from "@expo/vector-icons";

interface IProps {
  categories: ICategory[];
  isAddButton?: boolean;
  onPress?: (category: ICategory) => void;
}

const CategoryList = ({ categories, onPress, isAddButton }: IProps) => {
  return (
    <View style={styles.container}>
      {categories.map((item) => {
        if (!onPress) {
          return <CategoryButton category={item} />;
        }
        return (
          <CategoryButton category={item} onPress={() => onPress(item)}>
            <FontAwesome
              name={isAddButton ? "plus" : "minus"}
              size={16}
              color="#fff"
            />
          </CategoryButton>
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
