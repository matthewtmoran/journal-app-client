import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface IParams {
  EditEntry: {
    audioPath: string;
  };
  [key: string]: object;
}

interface IEditEntryNavigationProps extends RouteProp<IParams, "EditEntry"> {}

interface IEditEntryScreen {
  route: IEditEntryNavigationProps;
}

const EditEntryScreen = ({ route }: IEditEntryScreen) => {
  const { audioPath } = route.params;

  return (
    <View>
      <Text>Edit Entry</Text>
      <TextInput placeholder="Title" style={styles.input} />
      <TextInput
        placeholder="Audio Path"
        style={styles.input}
        editable={false}
        defaultValue={audioPath}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#2196f3",
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default EditEntryScreen;
