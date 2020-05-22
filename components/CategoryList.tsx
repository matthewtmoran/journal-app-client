import React from "react";
import { FlatList, Text } from "react-native";
import ICategory from "../interfaces/ICategory";

interface IProps {
  categories: ICategory[];
  onPress?: (category: ICategory) => void;
}

const CategoryList = ({ categories, onPress }: IProps) => {
  return (
    <>
      <FlatList
        data={categories}
        renderItem={({ item }) => {
          if (!onPress) {
            return <Text>{item.name}</Text>;
          }
          return <Text onPress={() => onPress(item)}>{item.name}</Text>;
        }}
        keyExtractor={(item) => item.name!}
      />
    </>
  );
};

export default CategoryList;
