import React from "react";
import { View } from "react-native";
import commonStyles from "../style/common";

interface IProps {
  color: string;
  size: number;
}

const CategoryCircle = ({ color, size }: IProps) => {
  return (
    <View
      style={{
        ...commonStyles.categoryCircle,
        backgroundColor: color,
        width: size,
        height: size,
      }}
    />
  );
};

export default CategoryCircle;
