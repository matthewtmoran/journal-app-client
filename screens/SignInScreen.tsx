import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { StyleSheet, View, TextInput, Button } from "react-native";
import { AuthContext } from "../components/Main";

const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = React.useContext(AuthContext);

  console.log({ email });
  console.log({ password });

  return (
    <View style={styles.container}>
      <Button
        title="Populate - Valid"
        onPress={() => {
          setEmail("matthewtmoran@gmail.com");
          setPassword("password");
        }}
      />
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
      <Button title="Sign In" onPress={() => signIn({ email, password })} />
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

export default SignInScreen;
