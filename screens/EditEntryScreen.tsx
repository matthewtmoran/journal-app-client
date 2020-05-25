import React, { useState, ChangeEvent } from "react";
import { useMutation } from "@apollo/react-hooks";
import { format } from "date-fns";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Button,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import gql from "graphql-tag";
import { ENTRIES_QUERY } from "../components/RecentEntries";
import AddCategories from "../components/AddCategories";
import * as FileSystem from "expo-file-system";
import IParams from "../interfaces/IParams";

interface IEditEntryRouteProps extends RouteProp<IParams, "EditEntry"> {}
interface IEditEntryNavigationProps
  extends NavigationProp<IParams, "EditEntry"> {}

interface IEditEntryScreen {
  route: IEditEntryRouteProps;
  navigation: IEditEntryNavigationProps;
}

interface ICategory {
  name: string;
  color: string;
}

interface ICreateEntryInput {
  title: string;
  body: string;
  description: string;
  categories: ICategory[];
  imagePath: string;
  audioFile: string;
  audioPath: string;
}

const CREATE_ENTRY_MUTATION = gql`
  mutation CreateEntryMutation(
    $title: String!
    $body: String
    $description: String
    $audioPath: String
    $audioFile: String
    $categories: [CreateCategoryInput!]
  ) {
    createEntry(
      data: {
        title: $title
        body: $body
        description: $description
        audioPath: $audioPath
        audioFile: $audioFile
        categories: $categories
      }
    ) {
      id
      title
      description
      createdAt
      imagePath
      audioPath
      body
      categories {
        id
        name
        color
      }
    }
  }
`;

const EditEntryScreen = ({ route, navigation }: IEditEntryScreen) => {
  const date = format(Date.now(), "yyyyMMddHHmm");
  const { audioPath } = route.params;
  const [title, setTitle] = useState(date);
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [createEntry, createEntryEvents] = useMutation(CREATE_ENTRY_MUTATION, {
    onCompleted(data) {
      navigation.navigate("Home");
    },
    onError(error) {
      console.log({ error });
    },
  });

  const handleSave = async () => {
    const audioFile: string = await FileSystem.readAsStringAsync(audioPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    createEntry({
      variables: { title, body, description, audioPath, audioFile, categories },
      update: (cache, { data: { createEntry } }) => {
        const data: any = cache.readQuery({ query: ENTRIES_QUERY });
        cache.writeQuery({
          query: ENTRIES_QUERY,
          data: { entries: [...data.entries, createEntry] },
        });
      },
    });
  };

  const handleAddCategory = (category: ICategory) => {
    setCategories((currentCategories: ICategory[]) => {
      return [...currentCategories, category];
    });
  };

  return (
    <View>
      <ScrollView>
        <Text>Edit Entry</Text>
        <View>
          <Text>Title</Text>
          <TextInput
            placeholder="Title"
            style={styles.input}
            defaultValue={date}
            onChangeText={(text: string) => setTitle(text)}
          />
        </View>
        <AddCategories
          categories={categories}
          onAddCategory={handleAddCategory}
        />
        <View>
          <Text>Body</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Body"
              numberOfLines={5}
              onChangeText={(text: string) => setBody(text)}
            />
          </View>
        </View>
        <View>
          <Text>Description</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Description"
              numberOfLines={5}
              multiline={true}
              onChangeText={(text: string) => setDescription(text)}
            />
          </View>
        </View>
        <View>
          <Text>Audio File</Text>
          <TextInput
            placeholder="Audio Path"
            style={styles.input}
            editable={false}
            defaultValue={audioPath}
          />
        </View>
        <Button title="Save" onPress={handleSave} />
      </ScrollView>
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
  textAreaContainer: {
    borderColor: "#2196f3",
    padding: 5,
    borderWidth: 2,
  },
  textArea: {
    height: 125,
    justifyContent: "flex-start",
    textAlignVertical: "top",
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
