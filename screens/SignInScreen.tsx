import React, { useRef, useState } from "react";
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
import ICredentials from "../interfaces/ICredentials";

interface ISignInScreenNavigationProps
  extends NavigationProp<IParams, "SignInScreen"> {}

interface ISignInScreen {
  navigation: ISignInScreenNavigationProps;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum."),
});

const initialValues: ICredentials = {
  email: "",
  password: "",
};

const SignInScreen = ({ navigation }: ISignInScreen) => {
  const { signIn } = React.useContext(AuthContext);
  const formikRef = useRef<any>(null);

  const apiError = (error: string) => {
    formikRef.current.setErrors({ api: error.replace("GraphQL error:", "") });
  };

  return (
    <View style={styles.container}>
      <Formik
        innerRef={formikRef}
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values: ICredentials) => {
          signIn(values).catch((error: any) => {
            apiError(error.message);
          });
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
            <RobotLightText style={CommonStyles.title}>Sign In</RobotLightText>
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

            {errors.api ? (
              <Text style={CommonStyles.errorText}>{errors.api}</Text>
            ) : null}

            <View style={CommonStyles.actionBar}>
              <SecondaryButton
                styles={CommonStyles.secondaryButton}
                onPress={() => navigation.navigate("Sign Up")}
              >
                Create Account
              </SecondaryButton>
              <PrimaryButton
                onPress={handleSubmit}
                isDisabled={!(isValid && dirty)}
              >
                Sign In
              </PrimaryButton>
            </View>
          </CardView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#144568",
    paddingTop: 40,
  },
});

export default SignInScreen;
