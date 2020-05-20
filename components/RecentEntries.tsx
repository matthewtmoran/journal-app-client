import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import EntryPreview from "./EntryPreview";

export const ENTRIES_QUERY = gql`
  query EntiesQuery {
    entries {
      id
      title
      description
      imagePath
      audioPath
      body
      categories {
        name
        color
      }
    }
  }
`;

const RecentEntries = () => {
  const { loading, error, data } = useQuery(ENTRIES_QUERY, {});
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text>{`Error: ${error.message}`}</Text>
      </View>
    );
  }

  const recent = data.entries.slice(
    data.entries.length - 4,
    data.entries.length
  );

  return (
    <View>
      <Text>Recent Entries</Text>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryPreview style={styles.item} entry={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default RecentEntries;
