import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AsyncStorage } from "react-native";
import { ApolloProvider } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AUTH_TOKEN } from "./constants";
import useCachedResources from "./hooks/useCachedResources";
import LinkingConfiguration from "./navigation/LinkingConfiguration";
import Main from "./components/Main";
import { AuthProvider } from "./state/auth-context";
import Constants from "expo-constants";

const typeDefs = gql`
  input CreateCategoryInput {
    id: ID
    color: String!
    count: Int
    name: String!
  }
`;

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: any, value: any) =>
      key === "__typename" ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    );
  }
  return forward(operation).map((data) => {
    return data;
  });
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const httpLink = createHttpLink({
  uri: Constants.manifest.extra.apiUrl,
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

const link = ApolloLink.from([cleanTypeName, authLink, errorLink, httpLink]);

const client = new ApolloClient({
  link,
  typeDefs,
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
        <AuthProvider>
          <Main />
        </AuthProvider>
      </NavigationContainer>
    </ApolloProvider>
  );
}
