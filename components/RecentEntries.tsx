import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import EntryPreview from "./EntryPreview";
import { RobotLightText } from "./StyledText";
import { ENTRIES_QUERY } from "../queries/queries";

const RecentEntries = () => {
  const { loading, error, data } = useQuery(ENTRIES_QUERY, {});
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <RobotLightText style={styles.message}>
          No recent entries.
        </RobotLightText>
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
