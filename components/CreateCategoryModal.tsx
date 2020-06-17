import React, { useState, useRef } from "react";
import ICategory from "../interfaces/ICategory";

import {
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CategoryList from "./CategoryList";
import filterUsedCategories from "../utils/filterUsedCategories";
import commonStyles from "../style/common";
import { RobotLightText, RobotText } from "./StyledText";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Formik } from "formik";
import * as yup from "yup";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const initialValues = {
  name: "",
  color: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Required"),
  color: yup.string().required("Required"),
});

const colors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

const { width: DEVICE_WIDTH } = Dimensions.get("window");

interface IProps {
  isModalVisible: boolean;
  onAddNewCategory(values: { name: string; color: string }): void;
  toggleModalVisibility(): void;
}

const CreateCategoryModal = ({
  isModalVisible,
  onAddNewCategory,
  toggleModalVisibility,
}: IProps) => {
  return (
    <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop={true}
      isVisible={isModalVisible}
    >
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values) => {
          onAddNewCategory(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          isValid,
          dirty,
        }) => {
          const handleSelectColor = (color: string) => {
            setFieldValue("color", color);
          };

          return (
            <View style={styles.modalInner}>
              <RobotText
                style={{ ...commonStyles.label, ...styles.modalTitle }}
              >
                Create Category
              </RobotText>

              <View style={styles.section}>
                <RobotText style={{ ...commonStyles.label, ...styles.label }}>
                  Enter Name
                </RobotText>
                <TextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  style={commonStyles.input}
                  value={values.name}
                  placeholder="Name"
                />
              </View>

              <View style={styles.section}>
                <RobotText style={{ ...commonStyles.label, ...styles.label }}>
                  Select Color
                </RobotText>
                <View style={styles.colorContainer}>
                  {colors.map((c) => {
                    return (
                      <TouchableOpacity onPress={() => handleSelectColor(c)}>
                        <View
                          style={{
                            ...styles.colorCircle,
                            backgroundColor: c,
                            ...(values.color === c
                              ? {
                                  transform: [{ scale: 1.3 }],
                                  shadowColor: c,
                                  shadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  shadowOpacity: 0.25,
                                  shadowRadius: 3.84,

                                  elevation: 5,
                                }
                              : {}),
                          }}
                        ></View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={{ ...styles.actionBar }}>
                <SecondaryButton onPress={toggleModalVisibility}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onPress={handleSubmit}
                  isDisabled={!(isValid && dirty)}
                >
                  Okay
                </PrimaryButton>
              </View>
            </View>
          );
        }}
      </Formik>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 22,
  },
  section: {
    marginVertical: 10,
  },
  actionBar: {
    marginHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  label: {
    fontSize: 18,
  },
  modalInner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 4,
    backgroundColor: "#fff",
    padding: 10,
    width: DEVICE_WIDTH / 1.1,
    height: "auto",
  },
  colorContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorCircle: {
    borderRadius: 100,
    width: 45,
    height: 45,
    margin: 6,
  },
  addButton: {
    width: "auto",
  },
});

export default CreateCategoryModal;
