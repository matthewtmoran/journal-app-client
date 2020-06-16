import React from "react";
import { ActivityIndicator } from "react-native";
import Modal from "react-native-modal";

const TransparentLoader = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      hasBackdrop={true}
      isVisible={isVisible}
    >
      <ActivityIndicator size="large" color="#fff" />
    </Modal>
  );
};

export default TransparentLoader;
