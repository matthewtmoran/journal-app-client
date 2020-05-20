import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const EntryPreview = ({ entry }: any) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("EntryDetails", { entry });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text>{entry.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    borderColor: "grey",
    borderWidth: 2,
    margin: 2,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default EntryPreview;
