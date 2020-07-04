import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import EntryPreview from "./EntryPreview";
import { RobotLightText, RobotText } from "./StyledText";
import { ENTRIES_QUERY } from "../queries/queries";
import { useEntry } from "../state/entry-context";
import { STATUS_PENDING } from "../constants";
import CardView from "./CardView";

const RecentEntries = () => {
  const { loading, error, data } = useQuery(ENTRIES_QUERY, {});
  const { status } = useEntry();
  if (loading) {
    return (
      <View style={styles.emptyContainer} testID="entries-loading">
        <ActivityIndicator size="small" color="#333" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text>{`Error: ${error.message}`}</Text>
      </View>
    );
  }

  const recent = data.entries
    .sort((a: any, b: any) => {
      return Number(new Date(a.createdAt)) - Number(new Date(b.createdAt));
    })
    .slice(data.entries.length - 4, data.entries.length);

  return (
    <View style={styles.container}>
      {status === STATUS_PENDING ? (
        <CardView style={styles.entryNotification}>
          <ActivityIndicator size={20} style={styles.notificationText} />
          <RobotText style={styles.notificationText}>
            Processing Entry
          </RobotText>
        </CardView>
      ) : null}
      {!recent.length ? (
        <View style={styles.emptyContainer}>
          <RobotLightText style={styles.message}>
            No recent entries.
          </RobotLightText>
        </View>
      ) : (
        <FlatList
          listKey="RecentEntries"
          style={styles.entries}
          data={recent}
          keyExtractor={(item) => item.id}
          horizontal={false}
          numColumns={2}
          renderItem={({ item, index }: any) => (
            <EntryPreview entry={item} index={index} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  emptyContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  entryNotification: {
    borderRadius: 2,
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginVertical: 4,
    paddingHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  notificationText: {
    paddingHorizontal: 8,
    fontSize: 16,
  },
  message: {
    fontStyle: "italic",
  },
  entries: {
    margin: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default RecentEntries;
