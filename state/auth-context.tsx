import React, { useReducer, createContext, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from "../queries/mutations";
import { AsyncStorage } from "react-native";
import { AUTH_TOKEN } from "../constants";
import ICredentials from "../interfaces/ICredentials";
import FullPageLoader from "../components/FullPageLoader";

interface IAppState {
  isLoading: boolean;
  userToken: string | null;
}

const AuthContext = createContext<any>(undefined);

const SIGN_OUT = "SIGN_OUT";
const SIGN_IN = "SIGN_IN";
const SIGN_UP = "SIGN_UP";
const RESTORE_TOKEN = "RESTORE_TOKEN";

const initialState: IAppState = {
  isLoading: true,
  userToken: null,
};

const AuthReducer = (prevState: any, action: any) => {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case SIGN_UP:
    case SIGN_IN:
      return {
        ...prevState,
        userToken: action.token,
      };
    case SIGN_OUT:
      return {
        ...prevState,
        userToken: null,
      };
  }
};

const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem(AUTH_TOKEN);
      } catch (error) {
        console.log({ error });
      }
      dispatch({ type: RESTORE_TOKEN, token });
    };
    bootstrapAsync();
  }, []);

  const [signIn, signinEvents] = useMutation(SIGNIN_MUTATION, {
    onCompleted(data) {
      const { token } = data.login;
      AsyncStorage.setItem(AUTH_TOKEN, token);
      dispatch({ type: SIGN_IN, token });
    },
    onError(error) {
      console.log({ error });
    },
  });

  const [signUp, signupEvents] = useMutation(SIGNUP_MUTATION, {
    onCompleted(data) {
      const { token } = data.createUser;
      AsyncStorage.setItem(AUTH_TOKEN, token);
      dispatch({ type: SIGN_UP, token });
    },
    onError(error) {
      console.log({ error });
    },
  });

  const authContext = useMemo(
    () => ({
      signIn: async ({ email, password }: ICredentials) => {
        return signIn({ variables: { email, password } }).then(() => {
          if (signinEvents.error) {
            throw new Error(signinEvents.error.message);
          }
        });
      },

      signOut: async (client: any) => {
        dispatch({ type: SIGN_OUT });
        await client.clearStore();
        await client.resetStore();
        await AsyncStorage.removeItem(AUTH_TOKEN);
      },

      signUp: async ({ email, password }: any) => {
        return signUp({ variables: { email, password } }).then(() => {
          if (signupEvents.error) {
            throw new Error(signupEvents.error.message);
          }
        });
      },
    }),
    []
  );

  if (state.isLoading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={{ ...authContext, ...state }}>
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
