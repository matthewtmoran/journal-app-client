import ICategory from "../interfaces/ICategory";

const filterDuplicateCategories = (used: ICategory[], unused: ICategory[]) => {
  const hash: { [key: string]: ICategory } = {};

  for (let i = 0; i < used.length; i++) {
    const item = used[i];
    hash[item.name] = item;
  }

  for (let i = 0; i < unused.length; i++) {
    const item = unused[i];
    hash[item.name] = item;
  }

  return Object.keys(hash).map((key) => {
    return hash[key];
  });
};

export default filterDuplicateCategories;
