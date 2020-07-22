import React, { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import IEntry from "../interfaces/IEntry";
import PlayAudio from "../components/PlayAudio";
import CategoryList from "../components/CategoryList";
import { RobotText, RobotLightItalicText } from "../components/StyledText";
import { format } from "date-fns";
import { ScrollView } from "react-native-gesture-handler";
import SecondaryButton from "../components/SecondaryButton";
import DropDownMenu from "../components/DropDownMenu";
import ConfirmDialog from "../components/ConfirmDialog";
import { useEntry } from "../state/entry-context";
import IParams from "../interfaces/IParams";
import TabBarIcon from "../components/TabBarIcon";

interface IEntryDetailsRouteProps extends RouteProp<IParams, "EntryDetails"> {}

interface IEntryDetailsScreen {
  route: IEntryDetailsRouteProps;
  navigation: ISignInScreenNavigationProps;
}

interface ISignInScreenNavigationProps
  extends NavigationProp<IParams, "EntryDetails"> {}

const EntryDetailsScreen = ({ navigation, route }: IEntryDetailsScreen) => {
  const [show, setShow] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const { handleDeleteEntry } = useEntry();

  const menuItems = [
    {
      label: "Edit",
      action: () => {
        hideDropDown();
        navigation.navigate("EditEntry", { ...route.params.entry });
      },
    },
    {
      label: "Remove",
      action: () => {
        hideDropDown();
        toggleConfirmDialogVisibility();
      },
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Entry Details",
      headerRight: () => (
        <SecondaryButton onPress={() => showDropDown()}>
          <TabBarIcon focused={false} name="md-more" />
        </SecondaryButton>
      ),
    });
  });

  const showDropDown = () => {
    setShow(true);
  };

  const hideDropDown = () => {
    setShow(false);
  };

  const toggleConfirmDialogVisibility = () => {
    setIsConfirmDialogVisible((current) => {
      return !current;
    });
  };

  const handleConfirmDelete = (entry: IEntry) => {
    handleDeleteEntry(entry);
    toggleConfirmDialogVisibility();
    navigation.navigate("Home");
  };

  const { entry } = route.params;
  const createdAt = format(new Date(entry.createdAt), "MMM do, yyyy");
  const updatedAt = format(new Date(entry.updatedAt), "MMM do, yyyy");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DropDownMenu isVisible={show} hide={hideDropDown} items={menuItems} />
      <ConfirmDialog
        title={`Are you sure you want to delete the ${entry.title}?`}
        message={`This will remove the entry and audio file from your device.`}
        isVisible={isConfirmDialogVisible}
        onConfirm={() => handleConfirmDelete(entry)}
        onCancel={toggleConfirmDialogVisibility}
      />
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
