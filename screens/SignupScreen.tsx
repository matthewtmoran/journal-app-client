import React, { useCallback, useRef, useReducer, useEffect } from "react";
import { useFocusEffect, NavigationProp } from "@react-navigation/native";
import { Text, StyleSheet, View, TextInput } from "react-native";
import * as yup from "yup";
import { Formik } from "formik";

import IParams from "../interfaces/IParams";
import CardView from "../components/CardView";
import PrimaryButton from "../components/PrimaryButton";
import CommonStyles from "../style/common";
import { RobotBoldText, RobotLightText } from "../components/StyledText";
import { STATUS_PENDING, STATUS_REJECTED } from "../constants";
import { useAuth } from "../state/auth-context";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum."),
});

interface ICredentials {
  email: string;
  password: string;
}

const initialValues: ICredentials = {
  email: "",
  password: "",
};

interface ISignInScreenNavigationProps
  extends NavigationProp<IParams, "SignInScreen"> {}

interface ISignupScreen {
  navigation: ISignInScreenNavigationProps;
}

const SignupScreen = ({ navigation }: ISignupScreen) => {
  const { signUp, status, error } = useAuth();
  const emailInput = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // @ts-ignore
      emailInput.current.focus();
    });

    return unsubscribe;
  });

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Register",
      });
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={async (values: ICredentials, { resetForm }) => {
          await signUp(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          dirty,
          touched,
        }) => (
          <CardView>
            <RobotLightText style={CommonStyles.title}>Register</RobotLightText>
            <RobotBoldText style={CommonStyles.label}>Email</RobotBoldText>
            <TextInput
              ref={emailInput}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={CommonStyles.input}
              placeholder="johndoe@example.com"
            />
            {errors.email && touched.email ? (
              <Text style={CommonStyles.errorText}>{errors.email}</Text>
            ) : null}

            <RobotBoldText style={CommonStyles.label}>Password</RobotBoldText>
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={CommonStyles.input}
              secureTextEntry={true}
              placeholder="Password"
            />
            {errors.password && touched.password ? (
              <Text style={CommonStyles.errorText}>{errors.password}</Text>
            ) : null}

            {status === STATUS_REJECTED ? (
              <Text style={CommonStyles.errorText}>
                {error.replace("GraphQL error: ", "")}
              </Text>
            ) : null}

            <PrimaryButton
              onPress={handleSubmit}
              isDisabled={status === STATUS_PENDING || !(isValid && dirty)}
              styles={{ margin: 10, width: "auto" }}
            >
              Create an account
            </PrimaryButton>
          </CardView>
        )}
      </Formik>
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
    backgroundColor: "#144568",
    paddingTop: 40,
  },
});

export default SignupScreen;
