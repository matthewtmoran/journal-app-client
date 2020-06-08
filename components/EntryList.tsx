import React from "react";
import { FlatList, Text, View } from "react-native";
import { ENTRIES_QUERY } from "./RecentEntries";
import { useQuery } from "@apollo/react-hooks";
import IEntry from "../interfaces/IEntry";
import ICategory from "../interfaces/ICategory";
import EntryResult from "./EntryResult";

interface IProps {
  searchTerm: string;
  categoryFilter: ICategory[];
  timeFilter: null | { value: number; label: string };
}

const EntryList = ({ searchTerm, categoryFilter, timeFilter }: IProps) => {
  const { loading, error, data } = useQuery(ENTRIES_QUERY, {});

  const milliseconds = timeFilter ? timeFilter.value * 24 * 60 * 60 * 1000 : 0;
  const currentTime = Date.now();
  const modifiedSince = currentTime - milliseconds;

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const filteredEntries = data.entries
    .filter((ent: IEntry) => {
      if (categoryFilter.length > 0) {
        return ent.categories.find((cat: ICategory) => {
          return categoryFilter.find((c) => {
            return c.id === cat.id;
          });
        });
      }
      return true;
    })
    .filter((ent: IEntry) => {
      if (timeFilter) {
        const modified = Date.parse(ent.updatedAt);
        return modified > modifiedSince;
      }
      return true;
    })
    .filter((d: IEntry) => {
      return (
        d.title.toLowerCase().includes(searchTerm) ||
        d.body.toLowerCase().includes(searchTerm) ||
        d.description.toLowerCase().includes(searchTerm)
      );
    });

  return (
    <View>
      <FlatList
        listKey="RecentEntries"
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        horizontal={false}
        numColumns={1}
        renderItem={({ item, index }: any) => (
          <EntryResult entry={item} index={index} />
        )}
      />
    </View>
  );
};

export default EntryList;
