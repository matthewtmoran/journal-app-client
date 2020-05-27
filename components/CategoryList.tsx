import React from "react";
import { FlatList, Text } from "react-native";
import ICategory from "../interfaces/ICategory";

interface IProps {
  categories: ICategory[];
  onPress?: (category: ICategory) => void;
  keyId?: string;
}

const CategoryList = ({ categories, onPress, keyId }: IProps) => {
  return (
    <>
      <FlatList
        listKey={`CategoryWordList-${keyId}`}
        data={categories}
        renderItem={({ item }) => {
          if (!onPress) {
            return <Text>{item.name}</Text>;
          }
          return <Text onPress={() => onPress(item)}>{item.name}</Text>;
        }}
        keyExtractor={(item) => item.name}
      />
    </>
  );
};

export default CategoryList;
