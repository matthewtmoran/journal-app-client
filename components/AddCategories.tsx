import React, { useState } from "react";
import ICategory from "../interfaces/ICategory";
import { View, Text, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CategoryList from "./CategoryList";
import filterUsedCategories from "../utils/filterUsedCategories";

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
  const userCategories = !loading
    ? filterUsedCategories(categories, data.categories)
    : [];

  const handleAddCategory = (category?: ICategory) => {
    // if user pressed an existing category
    if (category) {
      const { name, color, id } = category;
      return onAddCategory({ id, name, color });
    }

    // if user typed in a category
    // determin if category already exists
    const exists = data.categories.find((cat: ICategory) => {
      return name === cat.name;
    });

    // if it does not exist create a new category
    if (!exists) {
      onAddCategory({ name, color: "#333" });
    } else {
      // if it does exists pass all values
      const { id, name, color } = exists;
      onAddCategory({ id, name, color });
    }
    setName("");
  };

  return (
    <View>
      <Text>Assigned Categories</Text>
      <CategoryList categories={categories} keyId={"AssignedCategories"} />

      <Text>User's Categories</Text>
      {loading ? (
        <Text>Loading Categories...</Text>
      ) : (
        <CategoryList
          categories={userCategories}
          onPress={handleAddCategory}
          keyId={"UserCategories"}
        />
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
