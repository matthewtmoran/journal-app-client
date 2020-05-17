import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Button,
} from "react-native";

import useCachedResources from "../hooks/useCachedResources";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import LinkingConfiguration from "../navigation/LinkingConfiguration";
import Auth from "../utils/Auth";
import gql from "graphql-tag";

import { AuthContext } from "../components/Main";

const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(value) => setEmail(value)}
        style={styles.input}
        placeholder="Email"
      />
      <TextInput
        onChangeText={(value) => setPassword(value)}
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
      />
      <Button title="Sign Up" onPress={() => signUp({ email, password })} />
      <Button title="Sign In" onPress={() => navigation.navigate("Sign In")} />
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

export default SignupScreen;
