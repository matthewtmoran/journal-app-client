import React, { useState, useLayoutEffect } from "react";
import * as FileSystem from "expo-file-system";
import { useMutation } from "@apollo/react-hooks";
import { format } from "date-fns";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import { StyleSheet, TextInput, View, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";

import IParams from "../interfaces/IParams";
import SecondaryButton from "../components/SecondaryButton";
import { RobotText } from "../components/StyledText";
import CategoriesContainer from "../components/CategoriesContainer";
import commonStyles from "../style/common";
import IEntry from "../interfaces/IEntry";
import { useEntry } from "../state/entry-context";

interface IEditEntryRouteProps extends RouteProp<IParams, "EditEntry"> {}
interface IEditEntryNavigationProps
  extends NavigationProp<IParams, "EditEntry"> {}

interface IEditEntryScreen {
  route: IEditEntryRouteProps;
  navigation: IEditEntryNavigationProps;
}

interface ICategory {
  id?: string;
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

interface IUpdateInput extends IFormValues {
  id: string;
}

interface ICreateInput extends IFormValues {
  audioPath?: string;
}

const updateEntries = (entries: IEntry[], updated: IEntry) => {
  return entries.map((entry: IEntry) => {
    if (entry.id === updated.id) {
      return updated;
    }
    return entry;
  });
};

const EditEntryScreen = ({ route, navigation }: IEditEntryScreen) => {
  const { handleUpdateEntry, handleCreateEntry } = useEntry();
  const date = format(Date.now(), "MM/dd/yyyy h:mmaaa");
  const initialValues: IFormValues = {
    title: route.params.title || `${date}`,
    body: route.params.body || "",
    description: route.params.description || "",
    categories: route.params.categories || [],
  };

  const handleSave = async ({
    title,
    body,
    description,
    categories,
  }: IFormValues) => {
    if (!route.params.id) {
      handleCreateEntry({
        title,
        body,
        description,
        categories,
        audioPath: route.params.audioPath,
      });
    } else {
      handleUpdateEntry({
        id: route.params.id,
        title,
        body,
        description,
        categories,
      });
    }
    navigation.navigate("Home");
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
                headerTitle: route.params.id ? "Edit Entry" : "Create Entry",
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
                      value={values.description}
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
                      value={values.body}
                      style={commonStyles.textArea}
                      placeholder="Body"
                      multiline={true}
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
