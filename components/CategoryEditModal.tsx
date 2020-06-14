import React from "react";
import ICategory from "../interfaces/ICategory";

import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import commonStyles from "../style/common";
import { RobotText } from "./StyledText";
import Modal from "react-native-modal";
import { Formik } from "formik";
import * as yup from "yup";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

// do some ts stuff that doesn't actually work
declare module "yup" {
  // tslint:disable-next-line
  interface ArraySchema<T> {
    unique(mapper: (a: T) => T, message?: any): ArraySchema<T>;
  }
}

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
  category?: ICategory | null;
  categories: ICategory[];
  isModalVisible: boolean;
  onSubmit(values: { name: string; color: string; id: any }): void;
  toggleModalVisibility(): void;
}

const CategoryEditModal = ({
  categories,
  category,
  isModalVisible,
  onSubmit,
  toggleModalVisibility,
}: IProps) => {
  // add unique validation
  yup.addMethod(yup.string, "unique", function (
    mapper = (a: any) => a,
    message: string = "There is already a category with this name."
  ) {
    //@ts-ignore
    return this.test("unique", message, (value: any) => {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].name === value && category?.id !== categories[i].id) {
          return false;
        }
      }
      return true;
    });
  });

  const schema = yup.object().shape({
    name: yup
      .string()
      //@ts-ignore
      .unique((s) => s)
      .required("Required"),
    color: yup.string().required("Required"),
  });

  const initialValues = {
    name: category ? category.name : "",
    color: category ? category.color : "",
  };

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
          onSubmit({ ...values, id: category?.id });
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
          errors,
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

                {errors.name ? (
                  <Text style={commonStyles.errorText}>{errors.name}</Text>
                ) : null}
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
              <View style={{ ...commonStyles.actionBar, ...styles.actionBar }}>
                <SecondaryButton
                  styles={commonStyles.secondaryButton}
                  onPress={toggleModalVisibility}
                >
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

export default CategoryEditModal;
