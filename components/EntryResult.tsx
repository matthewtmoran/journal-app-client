import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import IEntry from "../interfaces/IEntry";
import {
  RobotLightItalicText,
  RobotThinItalicText,
  RobotLightText,
  RobotText,
} from "./StyledText";
import { format } from "date-fns";
import commonStyles from "../style/common";
import { FontAwesome } from "@expo/vector-icons";

interface IProps {
  entry: IEntry;
  index: number;
}

const EntryResult = ({ entry, index }: IProps) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("EntryDetails", { entry });
  };

  const updatedAt = format(new Date(entry.updatedAt), "MMM Qo, yyyy");

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconColumn}>
        <FontAwesome name="microphone" size={34} color="#333" />
      </View>

      <View style={{ flexGrow: 2, flex: 2 }}>
        <RobotText numberOfLines={1} style={styles.title}>
          {entry.title}
        </RobotText>
        <RobotLightItalicText style={styles.description}>
          {updatedAt}
        </RobotLightItalicText>
      </View>

      {entry.description.length > 0 && (
        <View
          style={{
            ...styles.column,
            display: "flex",
            flexWrap: "wrap",
            height: "100%",
            justifyContent: "flex-start",
            marginHorizontal: 4,
          }}
        >
          <RobotThinItalicText numberOfLines={1} style={styles.description}>
            {entry.description}
          </RobotThinItalicText>
        </View>
      )}

      <FlatList
        style={{ ...styles.categories, ...styles.column }}
        data={entry.categories}
        keyExtractor={(item) => item.id!}
        listKey={`CategoryResultList-${index}`}
        renderItem={({ item }) => {
          return (
            <View
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
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 10,
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categories: {
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    justifyContent: "flex-end",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    overflow: "hidden",
  },
  iconColumn: {
    width: 50,
    textAlign: "center",
    alignItems: "center",
  },
  column: {
    flex: 1,
  },
});

export default EntryResult;
