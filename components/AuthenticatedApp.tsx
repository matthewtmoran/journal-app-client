import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "../navigation/BottomTabNavigator";
import EditEntryScreen from "../screens/EditEntryScreen";
import EntryDetailsScreen from "../screens/EntryDetailsScreen";
import CategoryEditScreen from "../screens/CategoryEditScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

const AuthenticatedApp = () => (
  <Stack.Navigator headerMode="screen">
    <Stack.Screen name="Root" component={BottomTabNavigator} />
    <Stack.Screen name="EditEntry" component={EditEntryScreen} />
    <Stack.Screen name="EntryDetails" component={EntryDetailsScreen} />
    <Stack.Screen name="EditCategories" component={CategoryEditScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default AuthenticatedApp;
