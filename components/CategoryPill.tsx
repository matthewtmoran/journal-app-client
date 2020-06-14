import React from "react";
import { View, StyleSheet } from "react-native";
import ICategory from "../interfaces/ICategory";
import { RobotLightText } from "./StyledText";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {
  category: ICategory;
  onPress?: () => void;
}

const CategoryPill: React.FunctionComponent<IProps> = ({
  category,
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{ ...styles.button, backgroundColor: category.color }}
      onPress={onPress}
    >
      <RobotLightText style={styles.text}>{category.name}</RobotLightText>
      <View>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 16,
    marginRight: 8,
    textAlign: "center",
    width: "auto",
  },
  button: {
    alignItems: "center",
    borderRadius: 4,
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 4,
    minWidth: 75,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default CategoryPill;
