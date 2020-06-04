import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { format } from "date-fns";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import gql from "graphql-tag";
import { ENTRIES_QUERY } from "../components/RecentEntries";
import CategoriesContainer, {
  CATEGORIES_QUERY,
} from "../components/CategoriesContainer";
import * as FileSystem from "expo-file-system";
import IParams from "../interfaces/IParams";
import filterDuplicateCategories from "../utils/filterDuplicateCategories";
import commonStyles from "../style/common";

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
      updatedAt
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
      update: (cache, { data: { createEntry } }: any) => {
        const data: any = cache.readQuery({ query: ENTRIES_QUERY });
        const categoryData: any = cache.readQuery({ query: CATEGORIES_QUERY });

        cache.writeQuery({
          query: CATEGORIES_QUERY,
          data: {
            categories: filterDuplicateCategories(
              categoryData.categories,
              createEntry.categories
            ),
          },
        });

        cache.writeQuery({
          query: ENTRIES_QUERY,
          data: { entries: [...data.entries, createEntry] },
        });
      },
    });
  };

  const handleRemoveCategory = (category: ICategory) => {
    setCategories((currentCategories: ICategory[]) => {
      return currentCategories.filter((cat) => {
        return cat.name !== category.name;
      });
    });
  };

  const handleAddCategory = (category: ICategory) => {
    setCategories((currentCategories: ICategory[]) => {
      const set = new Set([...currentCategories, category]);

      //@ts-ignore
      const deDuped = [...set];
      return deDuped;
    });
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView>
        <Text style={commonStyles.title}>Edit Entry</Text>
        <View>
          <Text style={commonStyles.label}>Title</Text>
          <TextInput
            placeholder="Title"
            style={commonStyles.input}
            defaultValue={date}
            onChangeText={(text: string) => setTitle(text)}
          />
        </View>
        <CategoriesContainer
          categories={categories}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
        />
        <View>
          <Text>Body</Text>
          <View style={commonStyles.textAreaContainer}>
            <TextInput
              style={commonStyles.textArea}
              placeholder="Body"
              numberOfLines={5}
              onChangeText={(text: string) => setBody(text)}
            />
          </View>
        </View>
        <View>
          <Text>Description</Text>
          <View style={commonStyles.textAreaContainer}>
            <TextInput
              style={commonStyles.textArea}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
});

export default EditEntryScreen;
