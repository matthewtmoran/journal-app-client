import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";

export function renderWithNavigation(component: any) {
  const App = () => <NavigationContainer>{component}</NavigationContainer>;

  return { ...render(<App />) };
}
