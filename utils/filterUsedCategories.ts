import ICategory from "../interfaces/ICategory";

const filterUsedCategories = (used: ICategory[], all: ICategory[]) => {
  // if it's in used, remove from all

  const filtered = all.filter((cat) => {
    const exists = used.find((c) => {
      return c.name === cat.name;
    });

    return !exists;
  });

  return filtered ? filtered : [];
};

export default filterUsedCategories;
