import React, { useState } from "react";
import ICategory from "../interfaces/ICategory";
import { StyleSheet, View, Text } from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CategoryList from "./CategoryList";
import filterUsedCategories from "../utils/filterUsedCategories";
import commonStyles from "../style/common";
import { RobotLightText, RobotText } from "./StyledText";
import PrimaryButton from "./PrimaryButton";
import CreateCategoryModal from "./CreateCategoryModal";

interface IProps {
  categories: ICategory[];
  onAddCategory(category: ICategory): void;
  onRemoveCategory(category: ICategory): void;
}

export const CATEGORIES_QUERY = gql`
  query CategoriesQuery {
    categories {
      id
      name
      color
    }
  }
`;

const CategoriesContainer = ({
  categories,
  onAddCategory,
  onRemoveCategory,
}: IProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { loading, error, data } = useQuery(CATEGORIES_QUERY);

  const handleAddNewCategory = ({ name, color }: ICategory) => {
    const exists = data.categories.find((cat: ICategory) => {
      return name === cat.name;
    });
    if (!exists) {
      onAddCategory({ name, color });
    } else {
      // if it does exists pass all values
      const { id, name, color } = exists;
      onAddCategory({ id, name, color });
    }
    setIsModalVisible(false);
  };

  const renderLoading = () => {
    return <Text>Loading Categories...</Text>;
  };

  const renderCategoryList = () => {
    return (
      <CategoryList
        categories={userCategories}
        onPress={onAddCategory}
        isAddButton={true}
      />
    );
  };

  const toggleModalVisibility = () => {
    setIsModalVisible((current) => {
      return !current;
    });
  };

  // filter categories that are already selected
  const userCategories = !loading
    ? filterUsedCategories(categories, data.categories)
    : [];

  return (
    <View style={commonStyles.section}>
      <RobotText style={{ ...commonStyles.label, ...styles.label }}>
        Categories
      </RobotText>
      {categories.length > 0 ? (
        <CategoryList
          categories={categories}
          isAddButton={false}
          onPress={onRemoveCategory}
        />
      ) : (
        <RobotLightText style={commonStyles.message}>
          No Categories
        </RobotLightText>
      )}

      {userCategories.length > 0 && (
        <View>
          <RobotText style={{ ...commonStyles.label, ...styles.label }}>
            Popular Categories
          </RobotText>
          {loading ? renderLoading() : renderCategoryList()}
        </View>
      )}

      <PrimaryButton
        styles={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text>Create new category</Text>
      </PrimaryButton>

      <CreateCategoryModal
        isModalVisible={isModalVisible}
        onAddNewCategory={handleAddNewCategory}
        toggleModalVisibility={toggleModalVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 22,
  },
  addButton: {
    alignSelf: "center",
    width: "70%",
  },
});

export default CategoriesContainer;
