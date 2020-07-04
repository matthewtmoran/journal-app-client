import React, {
  FunctionComponent,
  useContext,
  createContext,
  useReducer,
  useMemo,
} from "react";
import * as FileSystem from "expo-file-system";
import { useMutation } from "@apollo/react-hooks";
import { CATEGORIES_QUERY, ENTRIES_QUERY } from "../queries/queries";
import {
  UPDATE_ENTRY_MUTATION,
  CREATE_ENTRY_MUTATION,
  DELETE_ENTRY_MUTATION,
} from "../queries/mutations";
import {
  STATUS_REJECTED,
  STATUS_RESOLVED,
  STATUS_PENDING,
  STATUS_IDLE,
  ERROR,
  SUCCESS,
  STARTED,
} from "../constants";
import ICategory from "../interfaces/ICategory";
import IEntry from "../interfaces/IEntry";
import filterDuplicateCategories from "../utils/filterDuplicateCategories";

interface IFormValues {
  body: string;
  description: string;
  title: string;
  categories: ICategory[];
}

interface IUpdateInput extends IFormValues {
  id: string;
}

interface ICreateInput extends IFormValues {
  audioPath?: string;
}

const updateEntries = (entries: IEntry[], updated: IEntry) => {
  return entries.map((entry: IEntry) => {
    if (entry.id === updated.id) {
      return updated;
    }
    return entry;
  });
};

interface IAction {
  type: typeof ERROR | typeof SUCCESS | typeof STARTED;
  error?: string | null;
}

type StatusTypes =
  | typeof STATUS_REJECTED
  | typeof STATUS_RESOLVED
  | typeof STATUS_PENDING
  | typeof STATUS_IDLE;

interface IState {
  status: StatusTypes;
  error?: string | null;
}

const initialState: IState = {
  status: STATUS_IDLE,
  error: null,
};

const EntryReducer = (prevState: IState, action: IAction): IState => {
  switch (action.type) {
    case STARTED:
      return {
        ...prevState,
        status: STATUS_PENDING,
        error: null,
      };
    case ERROR:
      return {
        ...prevState,
        status: STATUS_REJECTED,
        error: action.error,
      };
    case SUCCESS:
      return {
        ...prevState,
        status: STATUS_RESOLVED,
        error: null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const EntryProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(EntryReducer, initialState);
  const [updateEntry] = useMutation(UPDATE_ENTRY_MUTATION, {
    onCompleted(data) {
      dispatch({ type: SUCCESS });
    },
    onError(error) {
      dispatch({ type: ERROR, error: error.message });
    },
  });

  const [createEntry] = useMutation(CREATE_ENTRY_MUTATION, {
    onCompleted(data) {
      dispatch({ type: SUCCESS });
    },
    onError(error) {
      dispatch({ type: ERROR, error: error.message });
    },
  });

  const [deleteEntry] = useMutation(DELETE_ENTRY_MUTATION, {
    onCompleted(data) {
      dispatch({ type: SUCCESS });
    },
    onError(error) {
      dispatch({ type: ERROR, error: error.message });
    },
  });

  const entryContext = useMemo(
    () => ({
      handleCreateEntry: async ({
        title,
        body,
        description,
        categories,
        audioPath,
      }: ICreateInput) => {
        console.log("handleCreateEntry ");
        dispatch({ type: STARTED });
        const audioFile: string = await FileSystem.readAsStringAsync(
          audioPath,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        createEntry({
          variables: {
            title,
            body,
            description,
            audioPath,
            audioFile,
            categories,
          },
          update: (cache, { data: { createEntry } }: any) => {
            const data: any = cache.readQuery({ query: ENTRIES_QUERY });
            const categoryData: any = cache.readQuery({
              query: CATEGORIES_QUERY,
            });

            cache.writeQuery({
              query: CATEGORIES_QUERY,
              data: {
                categories: filterDuplicateCategories(
                  categoryData.categories,
                  createEntry.categories
                ),
              },
            });

            cache.writeQuery({
              query: ENTRIES_QUERY,
              data: { entries: [...data.entries, createEntry] },
            });
          },
        });
      },

      handleUpdateEntry: async ({
        id,
        title,
        body,
        description,
        categories,
      }: IUpdateInput) => {
        dispatch({ type: STARTED });
        updateEntry({
          variables: {
            id,
            title,
            body,
            description,
            categories,
          },
          update: (cache, { data: { updateEntry } }) => {
            const { entries } = cache.readQuery<{ entries: IEntry[] }>({
              query: ENTRIES_QUERY,
            })!;
            const { categories } = cache.readQuery<{ categories: ICategory[] }>(
              {
                query: CATEGORIES_QUERY,
              }
            )!;
            cache.writeQuery({
              query: CATEGORIES_QUERY,
              data: {
                categories: filterDuplicateCategories(
                  categories,
                  updateEntry.categories
                ),
              },
            });

            cache.writeQuery({
              query: ENTRIES_QUERY,
              data: { entries: updateEntries(entries, updateEntry) },
            });
          },
        });
      },

      handleDeleteEntry: async ({ id, audioPath }: IEntry) => {
        dispatch({ type: STARTED });

        deleteEntry({
          variables: { id },
          update: (cache, { data: { deleteEntry } }) => {
            const { entries } = cache.readQuery<{ entries: IEntry[] }>({
              query: ENTRIES_QUERY,
            })!;

            cache.writeQuery({
              query: ENTRIES_QUERY,
              data: { entries: entries.filter((e) => e.id !== deleteEntry.id) },
            });
          },
        });

        try {
          FileSystem.deleteAsync(audioPath);
        } catch (error) {
          console.log(
            "There was an error deleting file from file system",
            error
          );
        }
      },
    }),
    []
  );

  return (
    <EntryContext.Provider value={{ ...entryContext, ...state }}>
      {children}
    </EntryContext.Provider>
  );
};

const EntryContext = createContext<any>(undefined);

const useEntry = () => {
  const context = useContext(EntryContext);
  if (context === undefined) {
    throw new Error(`useEntry must be used within a EntryProvider`);
  }
  return context;
};

export { EntryProvider, useEntry };
