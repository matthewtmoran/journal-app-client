import React, { useReducer, createContext, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from "../queries/mutations";
import { ActivityIndicator, AsyncStorage } from "react-native";
import { AUTH_TOKEN } from "../constants";
import ICredentials from "../interfaces/ICredentials";
import TransparentLoader from "../components/TransparentLoader";
import * as SplashScreen from "expo-splash-screen";

interface IAppState {
  isLoading: boolean;
  userToken: string | null;
  error: null | string;
  status:
    | typeof STATUS_REJECTED
    | typeof STATUS_RESOLVED
    | typeof STATUS_PENDING
    | typeof STATUS_IDLE
    | typeof STATUS_BOOTSTRAPPING;
}

const AuthContext = createContext<any>(undefined);

const LOGGED_OUT = "LOGGED_OUT";
const SIGN_IN = "SIGN_IN";
const SIGN_UP = "SIGN_UP";
const RESTORE_TOKEN = "RESTORE_TOKEN";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";
const STARTED = "STARTED";
const BOOTSTRAPPING = "BOOTSTRAPPING ";

export const STATUS_REJECTED = "STATUS_REJECTED";
const STATUS_RESOLVED = "STATUS_RESOLVED";
export const STATUS_PENDING = "STATUS_PENDING";
const STATUS_IDLE = "STATUS_IDLE";
const STATUS_BOOTSTRAPPING = "STATUS_BOOTSTRAPPING";

const initialState: IAppState = {
  isLoading: true,
  userToken: null,
  status: STATUS_IDLE,
  error: null,
};

interface IAction {
  type: typeof ERROR | typeof SUCCESS | typeof STARTED | typeof LOGGED_OUT;
  error?: string | null;
  token?: string | null;
}

const AuthReducer = (prevState: any, action: IAction) => {
  switch (action.type) {
    case STARTED:
      return {
        ...prevState,
        userToken: null,
        status: STATUS_PENDING,
        error: null,
      };
    case ERROR:
      return {
        ...prevState,
        userToken: null,
        status: STATUS_REJECTED,
        error: action.error,
      };
    case SUCCESS:
      return {
        ...prevState,
        userToken: action.token,
        status: STATUS_RESOLVED,
        error: null,
      };
    case LOGGED_OUT:
      return {
        ...prevState,
        userToken: null,
        status: STATUS_IDLE,
        error: null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const AuthProvider: React.FunctionComponent<{ userToken: string | null }> = ({
  children,
  userToken,
}) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (userToken) {
        return dispatch({ type: SUCCESS, token: userToken });
      }

      // dispatch({ type: STARTED });
      // let token;
      // try {
      //   token = await AsyncStorage.getItem(AUTH_TOKEN);
      //   dispatch({ type: SUCCESS, token });
      // } catch (error) {
      //   console.log({ error });
      //   dispatch({ type: ERROR, error: error.message });
      // }
    };

    bootstrapAsync();
  }, []);

  const [login, loginEvents] = useMutation(SIGNIN_MUTATION, {
    onCompleted({ login: { token } }) {
      AsyncStorage.setItem(AUTH_TOKEN, token);
      dispatch({ type: SUCCESS, token });
    },
    onError(error) {
      console.log({ error });
      dispatch({ type: ERROR, error: error.message });
    },
  });

  const [register] = useMutation(SIGNUP_MUTATION, {
    onCompleted(data) {
      const { token } = data.createUser;
      AsyncStorage.setItem(AUTH_TOKEN, token);
      dispatch({ type: SUCCESS, token });
    },
    onError(error) {
      console.log({ error });
      dispatch({ type: ERROR, error: error.message });
    },
  });

  const authContext = useMemo(
    () => ({
      signIn: async ({ email, password }: ICredentials) => {
        dispatch({ type: STARTED });
        return login({ variables: { email, password } });
      },

      signOut: async (client: any) => {
        dispatch({ type: STARTED });
        await client.clearStore();
        await client.resetStore();
        await AsyncStorage.removeItem(AUTH_TOKEN);
        dispatch({ type: LOGGED_OUT });
      },

      signUp: async ({ email, password }: any) => {
        dispatch({ type: STARTED });
        return register({ variables: { email, password } });
      },
      reset: () => {
        dispatch({ type: LOGGED_OUT });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ ...authContext, ...state }}>
      <TransparentLoader isVisible={state.status === STATUS_PENDING} />
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};

export { AuthProvider, useAuth };
