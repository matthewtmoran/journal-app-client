import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignUpScreen from "../screens/SignupScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createStackNavigator();

const UnAuthenticatedApp = () => (
  <Stack.Navigator headerMode="screen">
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
  </Stack.Navigator>
);

export default UnAuthenticatedApp;
