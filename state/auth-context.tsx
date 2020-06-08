import React, { useReducer, createContext, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from "../queries/mutations";
import { AsyncStorage } from "react-native";
import { AUTH_TOKEN } from "../constants";
import ICredentials from "../interfaces/ICredentials";

const AuthContext = createContext<any>(undefined);

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

const SIGN_OUT = "SIGN_OUT";
const SIGN_IN = "SIGN_IN";
const SIGN_UP = "SIGN_UP";
const RESTORE_TOKEN = "RESTORE_TOKEN";

function AuthReducer(prevState: any, action: any) {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case SIGN_IN:
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case SIGN_OUT:
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
  }
}

const AuthProvider: React.FunctionComponent = ({ children }) => {
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem(AUTH_TOKEN);
      } catch (error) {}
      dispatch({ type: RESTORE_TOKEN, token });
    };
    bootstrapAsync();
  }, []);
  // if (loading) {
  //return spinner

  //   }
  const [state, dispatch] = useReducer(AuthReducer, initialState);

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
      signOut: async () => {
        console.log("SignOut");
        dispatch({ type: SIGN_OUT });
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

  return (
    <AuthContext.Provider value={{ ...authContext, ...state }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

// function useClient() {
//   const { user } = useAuth();
//   const token = user?.token;
//   return React.useCallback(
//     (endpoint, config) => client(endpoint, { ...config, token }),
//     [token]
//   );
// }

export { AuthProvider, useAuth };
