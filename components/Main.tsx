import React, { useReducer, createContext, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/react-hooks";
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "../navigation/BottomTabNavigator";
import SignUpScreen from "../screens/SignupScreen";
import SignInScreen from "../screens/SignInScreen";
import { AUTH_TOKEN } from "../constants";
import gql from "graphql-tag";
import { AsyncStorage } from "react-native";
import EditEntryScreen from "../screens/EditEntryScreen";
import EntryDetailsScreen from "../screens/EntryDetailsScreen";
import ICredentials from "../interfaces/ICredentials";

export const AuthContext = createContext<any>(undefined);

const Stack = createStackNavigator();

const SIGNIN_MUTATION = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!) {
    createUser(data: { email: $email, password: $password }) {
      token
    }
  }
`;

export default function Main({ navigation }: any) {
  const [state, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem(AUTH_TOKEN);
      } catch (error) {}
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };
    bootstrapAsync();
  }, []);

  const [signIn, signinEvents] = useMutation(SIGNIN_MUTATION, {
    onCompleted(data) {
      const { token } = data.login;
      AsyncStorage.setItem(AUTH_TOKEN, token);
      dispatch({ type: "SIGN_IN", token });
    },
    onError(error) {
      console.log({ error });
    },
  });

  const [signUp, signupEvents] = useMutation(SIGNUP_MUTATION, {
    onCompleted(data) {
      const { token } = data.createUser;
      dispatch({ type: "SIGN_UP", token });
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
        await AsyncStorage.removeItem(AUTH_TOKEN);
        dispatch({ type: "SIGN_OUT" });
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
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {state.userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen
              name="Sign Up"
              component={SignUpScreen}
              options={{
                title: "Sign Up",
                // When logging out, a pop animation feels intuitive
                // You can remove this if you want the default 'push' animation
                // animationTypeForReplace: state.isSignout ? "pop" : "push",
              }}
            />
            <Stack.Screen
              name="Sign In"
              component={SignInScreen}
              options={{
                title: "Sign In",
                // When logging out, a pop animation feels intuitive
                // You can remove this if you want the default 'push' animation
                // animationTypeForReplace: state.isSignout ? "pop" : "push",
              }}
            />
          </>
        ) : (
          // User is signed in
          <>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen name="EditEntry" component={EditEntryScreen} />
            <Stack.Screen name="EntryDetails" component={EntryDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
