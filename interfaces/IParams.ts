import ICategory from "./ICategory";
import IEntry from "./IEntry";

interface IParams {
  EditEntry: {
    id?: string;
    audioPath?: string;
    title?: string;
    body?: string;
    description?: string;
    categories?: ICategory[];
  };
  SignInScreen: {};
  EntryDetails: {
    entry: IEntry;
  };
  Home: {};
  [key: string]: object;
}
export default IParams;
