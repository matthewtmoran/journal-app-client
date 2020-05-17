import React, { useReducer, createContext, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/react-hooks";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";

import BottomTabNavigator from "../navigation/BottomTabNavigator";
import SignUpScreen from "../screens/SignupScreen";
import SignInScreen from "../screens/SignInScreen";
import { AUTH_TOKEN } from "../constants";
import gql from "graphql-tag";
import { AsyncStorage } from "react-native";

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
      signIn: async ({ email, password }: any) => {
        signIn({ variables: { email, password } });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async ({ email, password }: any) => {
        signUp({ variables: { email, password } });
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
          <Stack.Screen name="Root" component={BottomTabNavigator} />
          // <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#2196f3",
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
