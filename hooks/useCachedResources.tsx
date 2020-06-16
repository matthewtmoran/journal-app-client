import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { AsyncStorage } from "react-native";
import { AUTH_TOKEN } from "../constants";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const userToken = await AsyncStorage.getItem(AUTH_TOKEN);
        if (userToken) {
          setToken(userToken);
        }

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
          roboto: require("../assets/fonts/Roboto-Regular.ttf"),
          "roboto-thin": require("../assets/fonts/Roboto-Thin.ttf"),
          "roboto-italic": require("../assets/fonts/Roboto-Italic.ttf"),
          "roboto-thin-italic": require("../assets/fonts/Roboto-ThinItalic.ttf"),
          "roboto-bold": require("../assets/fonts/Roboto-Bold.ttf"),
          "roboto-light": require("../assets/fonts/Roboto-Light.ttf"),
          "roboto-light-italic": require("../assets/fonts/Roboto-LightItalic.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return { isLoadingComplete, token };
}
