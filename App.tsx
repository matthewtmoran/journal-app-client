import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Button,
} from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LinkingConfiguration from "./navigation/LinkingConfiguration";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { AUTH_TOKEN } from "./constants";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AppRegistry, AsyncStorage } from "react-native";
import { ApolloProvider } from "@apollo/react-hooks";
import Auth from "./utils/Auth";
import gql from "graphql-tag";
import { ApolloLink } from "apollo-link";
import Main from "./components/Main";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

const httpLink = createHttpLink({
  uri: "http://192.168.1.11:4000",
});

const authLink = setContext((_, { headers }) => {
  const token = AsyncStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    console.log("Not done loading");
    return null;
  }
  console.log("done loading");

  return (
    <ApolloProvider client={client}>
      <NavigationContainer linking={LinkingConfiguration}>
        <Main />
      </NavigationContainer>
    </ApolloProvider>
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
