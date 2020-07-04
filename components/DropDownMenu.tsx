import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { RobotText } from "./StyledText";

interface IItem {
  label: string;
  action(): void;
}

interface IProps {
  isVisible: boolean;
  items: IItem[];
  hide(): void;
}

const DropDownMenu = ({ items, isVisible, hide }: IProps) => {
  return (
    <Modal
      animationIn="slideInDown"
      animationOut="slideOutUp"
      hasBackdrop={false}
      isVisible={isVisible}
    >
      <TouchableWithoutFeedback onPress={() => hide()}>
        <View style={styles.container}>
          <View style={[styles.menu, { top: 0, right: 0 }]}>
            {items.map(({ label, action }) => {
              return (
                <TouchableOpacity
                  key={label}
                  style={{ ...styles.textContainer }}
                  onPress={action}
                >
                  <RobotText style={styles.text}>{label}</RobotText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DropDownMenu;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    textAlign: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    width: "50%",
    zIndex: 9999,
    display: "flex",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    textAlign: "left",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: "100%",
  },
  text: {
    textAlign: "left",
    fontSize: 16,
  },
});
