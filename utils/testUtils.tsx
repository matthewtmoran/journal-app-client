import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export function renderWithNavigation(component: any) {
  const App = () => <NavigationContainer>{component}</NavigationContainer>;

  return { ...render(<App />) };
}

export function renderWithScreen(component: any) {
  const App = () => <NavigationContainer>{component}</NavigationContainer>;

  return { ...render(<App />) };
}

export const renderWithNavigationScreen = (
  Component: any,
  props: any,
  params = {}
) => {
  return {
    ...render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MockedScreen"
            component={() => <Component {...props} />}
            initialParams={params}
          />
        </Stack.Navigator>
      </NavigationContainer>
    ),
  };
};

export const MockedNavigator = ({ component, params = {} }: any) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MockedScreen"
          component={component}
          initialParams={params}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
