import AsyncStorage from "@react-native-community/async-storage";

const setToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("@token", token);
  } catch (e) {
    console.log({ e });
    // saving error
  }
};

export default setToken;
