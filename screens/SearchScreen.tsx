import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useQuery } from "@apollo/react-hooks";
import { CATEGORIES_QUERY } from "../components/CategoriesContainer";
import ICategory from "../interfaces/ICategory";
import { RobotLightText } from "../components/StyledText";
import EntryList from "../components/EntryList";
import commonStyles from "../style/common";
import { FontAwesome } from "@expo/vector-icons";

interface ITime {
  label: string;
  value: number;
}

const times: ITime[] = [
  { label: "Today", value: 0 },
  { label: "Yesterday", value: 1 },
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

const SearchScreen = ({ onFocus }: any) => {
  const inputRef = useRef<any>(null);
  const navigation = useNavigation();
  const [inputTextValue, setInputTextValue] = useState("");
  const [cateogryFilter, setCategoryFilter] = useState<ICategory[]>([]);
  const [timeFilter, setTimeFilter] = useState<ITime | null>(null);

  const { loading, error, data } = useQuery(CATEGORIES_QUERY);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const stackNavigator = navigation.dangerouslyGetParent();
      if (stackNavigator) {
        stackNavigator.setOptions({
          headerShown: false,
        });
      }
      inputRef.current.focus();
    }, [navigation])
  );

  const handleAddDate = (time: ITime) => {
    setTimeFilter(time);
  };

  const handleRemoveTimeFilter = () => {
    setTimeFilter(null);
  };

  const handleAddCategoryFilter = (category: ICategory) => {
    setCategoryFilter((current: ICategory[]) => {
      return [...current, category];
    });
  };

  const handleRemoveCategoryFilter = (category: ICategory) => {
    setCategoryFilter((current: ICategory[]) => {
      const index = current.findIndex((cat) => {
        return cat.id === category.id;
      });

      return [
        ...current.slice(0, index),
        ...current.slice(index, current.length - 1),
      ];
    });
  };

  const shouldShowEntries =
    inputTextValue.length < 1 && cateogryFilter.length < 1 && !timeFilter;

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        onChangeText={(text) => setInputTextValue(text)}
        value={inputTextValue}
        style={commonStyles.input}
        placeholder="Search"
      ></TextInput>

      {/* Selected Categories */}
      <View style={styles.selectedContainer}>
        {cateogryFilter.length > 0 &&
          cateogryFilter.map((cat: ICategory) => {
            return (
              <TouchableOpacity
                key={cat.id}
                style={{
                  ...styles.selected,
                  backgroundColor: cat.color,
                  width: "auto",
                }}
                onPress={() => handleRemoveCategoryFilter(cat)}
              >
                <RobotLightText
                  style={{
                    ...styles.categoryName,
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  {cat.name}
                </RobotLightText>
                <FontAwesome name="times" size={16} color="#fff" />
              </TouchableOpacity>
            );
          })}

        {/* Selected Times */}
        {timeFilter && (
          <TouchableOpacity
            style={{
              ...styles.selected,
              backgroundColor: "#c4c4c4",
              width: "auto",
            }}
            onPress={() => handleRemoveTimeFilter()}
          >
            <RobotLightText
              style={{
                ...styles.categoryName,
                color: "#333",
                textAlign: "left",
              }}
            >
              {timeFilter.label}
            </RobotLightText>
            <FontAwesome name="times" size={16} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {shouldShowEntries ? (
        <View>
          <View style={styles.section}>
            <RobotLightText style={commonStyles.label}>
              Categories
            </RobotLightText>
            {loading && <ActivityIndicator />}
            {data &&
              data.categories &&
              data.categories.length > 0 &&
              data.categories.map((cat: ICategory) => {
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.category}
                    onPress={() => handleAddCategoryFilter(cat)}
                  >
                    <View
                      style={{
                        ...commonStyles.categoryCircle,
                        backgroundColor: cat.color,
                      }}
                    ></View>
                    <RobotLightText style={styles.categoryName}>
                      {cat.name}
                    </RobotLightText>
                  </TouchableOpacity>
                );
              })}
          </View>

          {/* Time Options */}
          <View style={styles.section}>
            <RobotLightText style={commonStyles.label}>Modified</RobotLightText>

            {times.map((t) => {
              return (
                <TouchableOpacity
                  key={t.label}
                  style={styles.category}
                  onPress={() => handleAddDate(t)}
                >
                  <FontAwesome name="calendar" size={16} color="#333" />
                  <RobotLightText style={styles.categoryName}>
                    {t.label}
                  </RobotLightText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <EntryList
          searchTerm={inputTextValue.toLowerCase()}
          categoryFilter={cateogryFilter}
          timeFilter={timeFilter}
        ></EntryList>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    marginHorizontal: 16,
  },
  selectedContainer: {
    display: "flex",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  selected: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: "auto",
    alignSelf: "flex-start",
    borderRadius: 6,
    justifyContent: "flex-start",
  },
  category: {
    marginVertical: 8,
    marginHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
  },
  categoryName: {
    marginHorizontal: 8,
    fontSize: 16,
  },
});

export default SearchScreen;
