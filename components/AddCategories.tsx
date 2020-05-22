import React, { useState } from "react";
import ICategory from "../interfaces/ICategory";
import { FlatList, View, Text, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CategoryList from "./CategoryList";

interface IProps {
  categories: ICategory[];
  onAddCategory(category: ICategory): void;
}

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateEntryMutation($name: String!) {
    createCategory(data: { name: $name, color: "#333" }) {
      id
      name
      color
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query CategoriesQuery {
    categories {
      id
      name
      color
    }
  }
`;

const AddCategories = ({ categories, onAddCategory }: IProps) => {
  const [name, setName] = useState("");
  const { loading, error, data } = useQuery(CATEGORIES_QUERY);

  // filter categories that are already selected
  const userCategories = data.categories.filter((cat: ICategory) => {
    const exists = categories.find((c) => {
      return c.id === cat.id;
    });
    return !exists;
  });

  const handleAddCategory = (category?: ICategory) => {
    if (category) {
      return onAddCategory(category);
    }
    onAddCategory({ name, color: "#333" });
    setName("");
  };

  return (
    <View>
      <Text>Assigned Categories</Text>
      <CategoryList categories={categories} />

      <Text>User's Categories</Text>
      {loading ? (
        <Text>Loading Categories...</Text>
      ) : (
        <CategoryList categories={userCategories} onPress={handleAddCategory} />
      )}

      <Text>Add New Category</Text>
      <TextInput
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Create new Category"
      />

      <Button title="Add Category" onPress={() => handleAddCategory()} />

      {/* Display categories */}
    </View>
  );
};

export default AddCategories;
