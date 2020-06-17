import React, { useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import IEntry from "../interfaces/IEntry";
import PlayAudio from "../components/PlayAudio";
import gql from "graphql-tag";
import CategoryList from "../components/CategoryList";
import { RobotText, RobotLightItalicText } from "../components/StyledText";
import { format } from "date-fns";
import { ScrollView } from "react-native-gesture-handler";
import SecondaryButton from "../components/SecondaryButton";

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
  navigation: ISignInScreenNavigationProps;
}

interface ISignInScreenNavigationProps
  extends NavigationProp<IParams, "EntryDetails"> {}

const EntryDetailsScreen = ({ navigation, route }: IEntryDetailsScreen) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Entry Details",
      headerRight: () => (
        <SecondaryButton
          onPress={() =>
            navigation.navigate("EditEntry", { ...route.params.entry })
          }
        >
          Edit
        </SecondaryButton>
      ),
    });
  });

  const { entry } = route.params;

  const createdAt = format(new Date(entry.createdAt), "MMM Qo, yyyy");
  const updatedAt = format(new Date(entry.updatedAt), "MMM Qo, yyyy");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.titleContainer, styles.sectionCard]}>
        <RobotText style={styles.title}>{entry.title}</RobotText>

        <View style={styles.section}>
          <View style={styles.dateContainer}>
            <RobotText style={styles.createdDate}>{createdAt} - </RobotText>
            <RobotLightItalicText style={styles.updatedDate}>
              {updatedAt}
            </RobotLightItalicText>
          </View>
        </View>
        <PlayAudio audioPath={entry.audioPath} />
      </View>

      <View style={styles.sectionCard}>
        <RobotText style={styles.label}>Categories</RobotText>
        <CategoryList categories={entry.categories} />
      </View>

      <View style={styles.sectionCard}>
        <RobotText style={styles.label}>Dictation</RobotText>
        <RobotText style={styles.text}>{entry.body}</RobotText>
      </View>

      <View style={styles.sectionCard}>
        <RobotText style={styles.label}>Description</RobotText>
        <View>
          <RobotText style={styles.text}>{entry.description}</RobotText>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    marginVertical: 0,
  },
  section: {
    marginVertical: 8,
  },
  sectionCard: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
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
    fontWeight: "bold",
    marginVertical: 5,
  },
  createdDate: {
    fontSize: 18,
  },
  text: {
    fontSize: 16,
  },
  updatedDate: {
    fontSize: 16,
  },
});

export default EntryDetailsScreen;
