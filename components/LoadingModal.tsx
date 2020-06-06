import React from "react";
import Modal from "react-native-modal";
import { ActivityIndicator, Dimensions, View, StyleSheet } from "react-native";
import { RobotLightText } from "./StyledText";
import commonnStyles from "../style/common";

const LoadingModal = ({ isModalVisible }: { isModalVisible: boolean }) => {
  return (
    <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop={true}
      isVisible={isModalVisible}
      style={styles.modalContainer}
    >
      <View style={styles.modalInner}>
        <RobotLightText style={{ ...commonnStyles.label, ...styles.label }}>
          Saving Entry
        </RobotLightText>
        <ActivityIndicator size={35} color="#333" />
      </View>
    </Modal>
  );
};

const { width: DEVICE_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 22,
  },
  modalInner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    borderRadius: 2,
    backgroundColor: "#fff",
    padding: 10,
    width: DEVICE_WIDTH / 1.8,
    height: "auto",
  },
});

export default LoadingModal;
