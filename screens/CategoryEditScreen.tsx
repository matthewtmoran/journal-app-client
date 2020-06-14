import React, { useCallback, useState, useLayoutEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import { CATEGORIES_QUERY } from "../queries/queries";
import { useQuery } from "@apollo/react-hooks";
import CategoryEditModal from "../components/CategoryEditModal";
import { RobotLightText } from "../components/StyledText";
import ConfirmDialog from "../components/ConfirmDialog";
import CategoryCircle from "../components/CategoryCircle";
import IconButton from "../components/IconButton";
import useManageCategory from "../hooks/useManageCategory";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import SecondaryButton from "../components/SecondaryButton";

interface IProps {}

const CategoryEditScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const { loading, error, data } = useQuery(CATEGORIES_QUERY);

  const navigation = useNavigation();

  const {
    handleUpdateCategory,
    handleDeleteCategory,
    handleCreateCategory,
  } = useManageCategory({
    onUpdateCompleted,
    onDeleteCompleted,
  });

  useFocusEffect(
    useCallback(() => {
      const stackNavigator = navigation.dangerouslyGetParent();
      if (stackNavigator) {
        stackNavigator.setOptions({
          headerRight: () => (
            <SecondaryButton onPress={handleEditCategory}>
              Create
            </SecondaryButton>
          ),
        });
      }
    }, [navigation])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Manage Categories",
      headerRight: () => (
        <SecondaryButton onPress={handleEditCategory}>Create</SecondaryButton>
      ),
    });
  });

  function onUpdateCompleted() {
    setSelectedCategory(null);
    toggleModalVisibility();
  }

  function onDeleteCompleted() {
    setSelectedCategory(null);
    toggleConfirmDialogVisibility();
  }

  // Open edit category modal
  const handleEditCategory = (cat?: ICategory) => {
    setSelectedCategory(cat || null);
    toggleModalVisibility();
  };

  // open delete category modal
  const openDeleteConfirm = (cat: ICategory) => {
    setSelectedCategory(cat);
    toggleConfirmDialogVisibility();
  };

  // toggle edit category modal
  const toggleModalVisibility = () => {
    setIsModalVisible((current) => {
      return !current;
    });
  };

  // toggle confirm dialog
  const toggleConfirmDialogVisibility = () => {
    setIsConfirmDialogVisible((current) => {
      return !current;
    });
  };

  const handleUpdateOrCreate = (cat: ICategory) => {
    if (cat.id) {
      handleUpdateCategory(cat);
    } else {
      handleCreateCategory(cat);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Some Error</Text>;
  }

  const { categories } = data;
  return (
    <View style={styles.container}>
      {categories.length > 0 &&
        categories.map((cat: ICategory, index: number) => {
          const isLastOption = index === categories.length - 1;
          const optionContainerStyles = [
            styles.option,
            isLastOption && styles.lastOption,
          ];
          return (
            <View key={cat.id} style={optionContainerStyles}>
              <View style={styles.optionIconContainer}>
                <CategoryCircle color={cat.color} size={30} />
              </View>
              <View style={styles.textContainer}>
                <RobotLightText style={styles.optionText}>
                  {cat.name}
                </RobotLightText>
              </View>
              <IconButton
                icon="pencil-square-o"
                onPress={() => handleEditCategory(cat)}
                style={styles.actionIcon}
                size={24}
                color="#333"
              />
              <IconButton
                icon="trash"
                onPress={() => openDeleteConfirm(cat)}
                style={styles.actionIcon}
                size={24}
                color="#333"
              />
            </View>
          );
        })}

      <CategoryEditModal
        category={selectedCategory}
        categories={data.categories}
        isModalVisible={isModalVisible}
        onSubmit={handleUpdateOrCreate}
        toggleModalVisibility={toggleModalVisibility}
      />
      <ConfirmDialog
        title={`Are you sure you want to delete the ${selectedCategory?.name} category?`}
        message={`This will remove the category from all entries.`}
        isVisible={isConfirmDialogVisible}
        onConfirm={() => handleDeleteCategory(selectedCategory)}
        onCancel={toggleConfirmDialogVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  smallColumn: {
    width: 60,
  },
  category: {
    marginVertical: 8,
    marginHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textContainer: {
    flex: 2,
    marginHorizontal: 8,
    fontSize: 24,
  },

  optionIconContainer: {
    marginRight: 12,
    width: 60,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
  actionIcon: {
    marginHorizontal: 8,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default CategoryEditScreen;
