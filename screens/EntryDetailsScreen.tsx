import React, { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import IEntry from "../interfaces/IEntry";
import PlayAudio from "../components/PlayAudio";
import { FlatList } from "react-native-gesture-handler";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CategoryList from "../components/CategoryList";

interface IParams {
  EntryDetails: {
    entry: IEntry;
  };
  [key: string]: object;
}

export const ENTRIES_QUERY = gql`
  query EntiesQuery {
    entries {
      id
      title
      description
      imagePath
      audioPath
      body
      createdAt
      categories {
        id
        name
        color
      }
    }
  }
`;

interface IEntryDetailsRouteProps extends RouteProp<IParams, "EntryDetails"> {}

interface IEntryDetailsScreen {
  route: IEntryDetailsRouteProps;
}

const EntryDetailsScreen = ({ route }: IEntryDetailsScreen) => {
  const { entry } = route.params;
  return (
    <View>
      <Text>Title</Text>
      <Text>{entry.title}</Text>
      <Text>Description</Text>
      <Text>{entry.description}</Text>
      <Text>Categories</Text>
      <CategoryList categories={entry.categories} />

      <Text>File Location</Text>
      <Text>{entry.audioPath}</Text>
      <PlayAudio audioPath={entry.audioPath} />
    </View>
  );
};

export default EntryDetailsScreen;
