import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AsyncStorage } from "react-native";
import { ApolloProvider } from "@apollo/react-hooks";

import { AUTH_TOKEN } from "./constants";
import useCachedResources from "./hooks/useCachedResources";
import LinkingConfiguration from "./navigation/LinkingConfiguration";
import Main from "./components/Main";

const httpLink = createHttpLink({
  uri: "http://192.168.1.11:4000",
});

const authLink = setContext((_, { headers }: any) => {
  return AsyncStorage.getItem(AUTH_TOKEN).then((token) => {
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    }
    return {
      headers: {
        ...headers,
      },
    };
  });
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }
  return (
    <ApolloProvider client={client}>
      <NavigationContainer linking={LinkingConfiguration}>
        <Main />
      </NavigationContainer>
    </ApolloProvider>
  );
}
