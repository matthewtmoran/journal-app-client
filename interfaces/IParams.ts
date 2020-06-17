import ICategory from "./ICategory";

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
  [key: string]: object;
}
export default IParams;
