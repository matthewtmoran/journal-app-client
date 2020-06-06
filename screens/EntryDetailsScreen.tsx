import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { RouteProp } from "@react-navigation/native";
import IEntry from "../interfaces/IEntry";
import PlayAudio from "../components/PlayAudio";
import gql from "graphql-tag";
import CategoryList from "../components/CategoryList";
import { RobotText, RobotLightItalicText } from "../components/StyledText";
import { format } from "date-fns";
import commonStyles from "../style/common";
import { ScrollView } from "react-native-gesture-handler";

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

  const createdAt = format(new Date(entry.createdAt), "MMM Qo, yyyy");
  const updatedAt = format(new Date(entry.updatedAt), "MMM Qo, yyyy");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <RobotText style={styles.title}>{entry.title}</RobotText>

        <View style={styles.section}>
          <View style={styles.dateContainer}>
            <RobotText style={styles.createdDate}>{createdAt} - </RobotText>
            <RobotLightItalicText style={styles.updatedDate}>
              {updatedAt}
            </RobotLightItalicText>
          </View>
        </View>
      </View>

      <PlayAudio audioPath={entry.audioPath} />
      <CategoryList categories={entry.categories} />

      <View style={styles.section}>
        <RobotText style={styles.label}>Dictated Text</RobotText>
        <View style={commonStyles.textAreaContainer}>
          <TextInput
            style={commonStyles.textArea}
            placeholder="Body"
            numberOfLines={5}
            multiline={true}
            value={entry.body}
            // onChangeText={(text: string) => setDescription(text)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <RobotText style={styles.label}>Description</RobotText>
        <View style={commonStyles.textAreaContainer}>
          <TextInput
            style={commonStyles.textArea}
            placeholder="Description"
            numberOfLines={5}
            multiline={true}
            value={entry.description}
            // onChangeText={(text: string) => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 0,
  },
  section: {
    marginVertical: 8,
  },
  titleContainer: {
    marginTop: 30,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
  },
  label: {
    color: "#333",
    fontSize: 18,
    marginVertical: 5,
  },
  createdDate: {
    fontSize: 18,
  },
  updatedDate: {
    fontSize: 16,
  },
});

export default EntryDetailsScreen;
