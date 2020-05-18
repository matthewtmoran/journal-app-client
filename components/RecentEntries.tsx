import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const ENTRIES_QUERY = gql`
  query EntiesQuery {
    entries {
      id
      title
      categories {
        name
        color
      }
    }
  }
`;

const RecentEntries: FunctionComponent = () => {
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
  return (
    <View>
      <Text>Recent Entries</Text>
      <FlatList
        data={data.entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
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
