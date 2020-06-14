import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { RobotText, RobotLightText } from "./StyledText";
import commonStyles from "../style/common";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";

interface IProps {
  title: string;
  message: string;
  isVisible: boolean;
  onConfirm(): void;
  onCancel(): void;
}

const { width: DEVICE_WIDTH } = Dimensions.get("window");

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  isVisible,
}: IProps) => {
  return (
    <Modal
      style={styles.modalContainer}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop={true}
      isVisible={isVisible}
    >
      <View style={styles.modalInner}>
        <RobotText style={{ ...commonStyles.label, ...styles.modalTitle }}>
          {title}
        </RobotText>
        <RobotLightText style={styles.modalMessage}>{message}</RobotLightText>

        <View style={{ ...commonStyles.actionBar, ...styles.actionBar }}>
          <SecondaryButton
            styles={commonStyles.secondaryButton}
            onPress={onCancel}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton onPress={onConfirm}>Okay</PrimaryButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalInner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 4,
    backgroundColor: "#fff",
    padding: 10,
    width: DEVICE_WIDTH / 1.1,
    height: "auto",
  },
  modalTitle: {
    textAlign: "left",
    fontSize: 22,
  },
  modalMessage: {
    fontSize: 16,
  },
  actionBar: {
    marginTop: 30,
  },
});

export default ConfirmDialog;
