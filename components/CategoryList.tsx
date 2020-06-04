import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import CategoryButton from "./CategoryButton";

interface IProps {
  categories: ICategory[];
  onPress?: (category: ICategory) => void;
  keyId?: string;
}

const CategoryList = ({ categories, onPress, keyId }: IProps) => {
  return (
    <View style={styles.container}>
      {categories.map((item) => {
        if (!onPress) {
          return <CategoryButton category={item} />;
        }
        return <CategoryButton category={item} onPress={() => onPress(item)} />;
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
