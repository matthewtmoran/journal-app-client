import React, { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import IEntry from "../interfaces/IEntry";

interface IParams {
  EntryDetails: {
    entry: IEntry;
  };
  [key: string]: object;
}

interface IEntryDetailsRouteProps extends RouteProp<IParams, "EntryDetails"> {}

interface IEntryDetailsScreen {
  route: IEntryDetailsRouteProps;
}

const EntryDetailsScreen = ({ route }: IEntryDetailsScreen) => {
  const { entry } = route.params;

  return (
    <View>
      <Text>{entry.title}</Text>
      <Text>{entry.description}</Text>
      <Text>{entry.audioPath}</Text>
    </View>
  );
};

export default EntryDetailsScreen;
