import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";

import { useAuth } from "../state/auth-context";

export default function LinksScreen({ navigation }: any) {
  const auth = useAuth();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <OptionButton
        icon="md-settings"
        label="Settings"
        onPress={() => navigation.navigate("Settings")}
      />

      <OptionButton
        icon="md-pricetags"
        label="Edit categories"
        onPress={() => navigation.navigate("EditCategories")}
      />

      {/* <OptionButton
        icon="md-cloud-download"
        label="Export Data"
        onPress={() => WebBrowser.openBrowserAsync("https://forums.expo.io")}
        isLastOption
      /> */}

      <OptionButton
        icon="md-exit"
        label="Logout"
        onPress={() => auth.signOut()}
        isLastOption
      />
    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }: any) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View>
          {/* <View style={styles.optionTextContainer}> */}
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#fafafa",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
});
