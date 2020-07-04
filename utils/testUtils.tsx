import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { EntryProvider } from "../state/entry-context";
import { MockedProvider } from "@apollo/react-testing";
import { ENTRIES_QUERY } from "../queries/queries";

const Stack = createStackNavigator();

export function renderWithNavigation(component: any) {
  const App = () => <NavigationContainer>{component}</NavigationContainer>;

  return { ...render(<App />) };
}

export const renderWithApolloProvider = (
  Component: any,
  props: any,
  params = {}
) => {
  return (
    <MockedProvider mocks={{}}>
      <Component {...props} />
    </MockedProvider>
  );
};
