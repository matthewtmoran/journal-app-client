import React from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface IProps {
  icon: string;
  style: { [key: string]: any };
  size: number;
  color: string;
  onPress(): void;
}

const IconButton = ({ icon, onPress, style, size, color }: IProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <FontAwesome name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default IconButton;
