import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import IEntry from "../interfaces/IEntry";
import {
  RobotLightItalicText,
  RobotThinItalicText,
  RobotText,
} from "./StyledText";
import { format } from "date-fns";
import commonStyles from "../style/common";

interface IProps {
  entry: IEntry;
  index: number;
}

const EntryPreview = ({ entry, index }: IProps) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("EntryDetails", { entry });
  };

  const updatedAt = format(new Date(entry.updatedAt), "MMM do, yyyy");
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      testID="preview-button"
    >
      <View>
        <RobotText numberOfLines={1} style={styles.title}>
          {entry.title}
        </RobotText>
        <RobotLightItalicText style={styles.description}>
          {updatedAt}
        </RobotLightItalicText>
        <RobotThinItalicText numberOfLines={1} style={styles.description}>
          {entry.description}
        </RobotThinItalicText>
      </View>
      <FlatList
        style={styles.categories}
        data={entry.categories}
        keyExtractor={(item) => item.id!}
        listKey={`CategoryColorList-${index}`}
        renderItem={({ item }) => {
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
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
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
    justifyContent: "space-between",
  },
  categories: {
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
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
    fontSize: 14,
    overflow: "hidden",
  },
});

export default EntryPreview;
