import { useMutation } from "@apollo/react-hooks";
import { ENTRIES_QUERY, CATEGORIES_QUERY } from "../queries/queries";
import {
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
} from "../queries/mutations";
import ICategory from "../interfaces/ICategory";

interface IUseUpdateCategory {
  onUpdateCompleted(): void;
  onDeleteCompleted(): void;
}

export const useManageCategory = ({
  onUpdateCompleted,
  onDeleteCompleted,
}: IUseUpdateCategory) => {
  // update category hook
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION, {
    onCompleted(data) {
      onUpdateCompleted();
    },
    onError(error) {
      console.log({ error });
    },
  });

  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION, {
    onCompleted(data) {
      onUpdateCompleted();
    },
    onError(error) {
      console.log({ error });
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION, {
    onCompleted(data) {
      onDeleteCompleted();
    },
    onError(error) {
      console.log({ error });
    },
  });

  const handleCreateCategory = ({ name, color }: ICategory) => {
    createCategory({
      variables: { name, color },
      update: (cache, { data: { createCategory } }: any) => {
        // update category cache
        const categoryData: any = cache.readQuery({ query: CATEGORIES_QUERY });
        cache.writeQuery({
          query: CATEGORIES_QUERY,
          data: {
            categories: [...categoryData.categories, createCategory],
          },
        });
        // update entry cache
        const entryData: any = cache.readQuery({ query: ENTRIES_QUERY });
        cache.writeQuery({
          query: ENTRIES_QUERY,
          data: {
            entries: entryData.entries,
          },
        });
      },
    });
  };

  const handleUpdateCategory = ({ name, color, id }: ICategory) => {
    updateCategory({
      variables: { name, color, id },
      update: (cache, { data: { updateCategory } }: any) => {
        // update category cache
        const categoryData: any = cache.readQuery({ query: CATEGORIES_QUERY });
        cache.writeQuery({
          query: CATEGORIES_QUERY,
          data: {
            categories: categoryData.categories,
          },
        });
        // update entry cache
        const entryData: any = cache.readQuery({ query: ENTRIES_QUERY });
        cache.writeQuery({
          query: ENTRIES_QUERY,
          data: {
            entries: entryData.entries,
          },
        });
      },
    });
  };

  const handleDeleteCategory = ({ id }: ICategory) => {
    deleteCategory({
      variables: { id },
      update: (cache, { data: { deleteCategory } }: any) => {
        // update category cache
        const categoryData: any = cache.readQuery({ query: CATEGORIES_QUERY });
        cache.writeQuery({
          query: CATEGORIES_QUERY,
          data: {
            categories: categoryData.categories.filter(
              (cat: ICategory) => cat.id !== deleteCategory.id
            ),
          },
        });
      },
    });
  };
  return { handleUpdateCategory, handleDeleteCategory, handleCreateCategory };
};

export default useManageCategory;
