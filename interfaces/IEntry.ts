import ICategory from "./ICategory";
interface IEntry {
  id?: string;
  title: string;
  body: string;
  description: string;
  categories: ICategory[];
  imagePath: string;
  audioPath: string;
  updatedAt: string;
}

export default IEntry;
