import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import IEntry from "../interfaces/IEntry";
import {
  RobotLightItalicText,
  RobotThinItalicText,
  RobotText,
} from "./StyledText";
import { format } from "date-fns";
import commonStyles from "../style/common";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

interface IProps {
  entry: IEntry;
  index: number;
}

const EntryPreview = ({ entry }: IProps) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("EntryDetails", { entry });
  };

  const updatedAt = format(new Date(entry.updatedAt), "MMM do, yyyy");
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={handlePress}
      testID="preview-button"
    >
      <ScrollView style={styles.details}>
        <RobotText numberOfLines={1} style={styles.title}>
          {entry.title}
        </RobotText>
        <RobotLightItalicText style={styles.description}>
          {updatedAt}
        </RobotLightItalicText>
        <RobotThinItalicText numberOfLines={2} style={styles.description}>
          {entry.description}
        </RobotThinItalicText>
        <ScrollView>
          <RobotThinItalicText style={styles.description}>
            {entry.body}
          </RobotThinItalicText>
        </ScrollView>
      </ScrollView>
      <ScrollView
        horizontal={true}
        style={styles.categories}
        contentContainerStyle={{
          justifyContent: "flex-start",
        }}
      >
        {entry.categories.map((item) => {
          return (
            <View
              testID={"category"}
              key={item.id}
              style={{
                ...commonStyles.categoryCircle,
                backgroundColor: `${item.color}`,
              }}
            />
          );
        })}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginVertical: 10,
    marginHorizontal: 10,
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    display: "flex",
  },
  details: {
    overflow: "hidden",
    flex: 1,
  },
  categories: {
    height: 20,
    maxHeight: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    height: 18,
    fontSize: 16,
  },
  description: {
    marginVertical: 2,
    fontSize: 14,
    overflow: "hidden",
  },
});

export default EntryPreview;
