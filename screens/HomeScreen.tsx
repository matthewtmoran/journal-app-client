import React, { useCallback } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import RecentEntries from "../components/RecentEntries";
import RecordAudioContainer from "../components/RecordAudio";
import SearchInput from "../components/SearchInput";
import { useAuth } from "../state/auth-context";

export default function HomeScreen({ navigation }: any) {
  const auth = useAuth();

  useFocusEffect(
    useCallback(() => {
      const stackNavigator = navigation.dangerouslyGetParent();
      if (stackNavigator) {
        stackNavigator.setOptions({
          headerShown: false,
        });
      }
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <SearchInput navigation={navigation} />
      <RecentEntries />
      <RecordAudioContainer navigation={navigation} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <Button
            title="Logout"
            onPress={() => {
              auth.signOut();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 30,
  },
});
