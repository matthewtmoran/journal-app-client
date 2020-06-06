import React, { useState, useLayoutEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { format } from "date-fns";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import { StyleSheet, TextInput, View, Button } from "react-native";
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
import { Formik } from "formik";
import * as yup from "yup";
import SecondaryButton from "../components/SecondaryButton";
import { RobotText } from "../components/StyledText";
import LoadingModal from "../components/LoadingModal";

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

const schema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string(),
  categories: yup
    .array()
    .of(yup.object().shape({ name: yup.string(), color: yup.string() })),
});

interface IFormValues {
  body: string;
  description: string;
  title: string;
  categories: ICategory[];
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
  const [isLoading, setIsLoading] = useState(false);
  const { audioPath } = route.params;
  const date = format(Date.now(), "yyyyMMddHHmm");
  const initialValues: IFormValues = {
    body: "",
    description: "",
    title: `Untitled-${date}`,
    categories: [],
  };

  const [createEntry, createEntryEvents] = useMutation(CREATE_ENTRY_MUTATION, {
    onCompleted(data) {
      setIsLoading(false);
      navigation.navigate("Home");
    },
    onError(error) {
      console.log({ error });
    },
  });

  const handleSave = async ({
    title,
    body,
    description,
    categories,
  }: IFormValues) => {
    setIsLoading(true);
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

  return (
    <View style={commonStyles.container}>
      <ScrollView>
        <Formik
          validationSchema={schema}
          initialValues={initialValues}
          onSubmit={(values) => {
            handleSave(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
          }) => {
            // set the header options
            useLayoutEffect(() => {
              navigation.setOptions({
                headerTitle: "Save Entry",
                headerRight: () => (
                  <SecondaryButton onPress={handleSubmit}>Save</SecondaryButton>
                ),
              });
            });

            const handleAddCategory = (category: ICategory) => {
              const set = new Set([...values.categories, category]);
              // @ts-ignore
              const deDuped = [...set];
              setFieldValue("categories", deDuped);
            };

            const handleRemoveCategory = (category: ICategory) => {
              const cats = values.categories.filter((cat) => {
                return cat.name !== category.name;
              });
              setFieldValue("categories", cats);
            };

            return (
              <View>
                {/* title section */}
                <LoadingModal isModalVisible={isLoading} />
                <View style={commonStyles.section}>
                  <RobotText style={{ ...commonStyles.label, ...styles.label }}>
                    Title
                  </RobotText>
                  <TextInput
                    defaultValue={values.title}
                    onBlur={handleBlur("title")}
                    onChangeText={handleChange("title")}
                    placeholder="Title"
                    style={commonStyles.input}
                    value={values.title}
                  />
                </View>
                <CategoriesContainer
                  categories={values.categories}
                  onAddCategory={handleAddCategory}
                  onRemoveCategory={handleRemoveCategory}
                />
                {/* description section */}
                <View style={commonStyles.section}>
                  <RobotText style={{ ...commonStyles.label, ...styles.label }}>
                    Description
                  </RobotText>
                  <View style={commonStyles.textAreaContainer}>
                    <TextInput
                      style={commonStyles.textArea}
                      placeholder="Description"
                      numberOfLines={5}
                      multiline={true}
                      onBlur={handleBlur("description")}
                      onChangeText={handleChange("description")}
                    />
                  </View>
                </View>
                {/* body section */}
                <View style={commonStyles.section}>
                  <RobotText style={{ ...commonStyles.label, ...styles.label }}>
                    Body
                  </RobotText>
                  <View style={commonStyles.textAreaContainer}>
                    <TextInput
                      style={commonStyles.textArea}
                      placeholder="Body"
                      numberOfLines={5}
                      onBlur={handleBlur("body")}
                      onChangeText={handleChange("body")}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        </Formik>
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
  label: {
    fontSize: 18,
  },
});

export default EditEntryScreen;
