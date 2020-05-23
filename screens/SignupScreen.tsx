import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Text, StyleSheet, View, TextInput, Button } from "react-native";
import { AuthContext } from "../components/Main";
import { RobotBoldText, RobotLightText } from "../components/StyledText";
import CardView from "../components/CardView";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import IParams from "../interfaces/IParams";
import CommonStyles from "../style/common";
import * as yup from "yup";
import { Formik } from "formik";

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

const initialValues = {
  email: "",
  password: "",
};

interface ISignInScreenNavigationProps
  extends NavigationProp<IParams, "SignInScreen"> {}

interface ISignupScreen {
  navigation: ISignInScreenNavigationProps;
}

const SignupScreen = ({ navigation }: ISignupScreen) => {
  const { signUp } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values: ICredentials) => {
          signUp(values);
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
            <RobotLightText style={CommonStyles.title}>
              Create Account
            </RobotLightText>
            <RobotBoldText style={CommonStyles.label}>Email</RobotBoldText>
            <TextInput
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

            <View style={CommonStyles.actionBar}>
              <SecondaryButton
                styles={CommonStyles.secondaryButton}
                onPress={() => navigation.navigate("Sign In")}
              >
                Sign In
              </SecondaryButton>
              <PrimaryButton
                onPress={handleSubmit}
                isDisabled={!(isValid && dirty)}
              >
                Create Account
              </PrimaryButton>
            </View>
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
