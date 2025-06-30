import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
  ModalProps,
  Text,
} from "react-native";


interface LoaderProps extends Partial<ModalProps> {
  loading: boolean;
  loaderText?: string;
}

const LoaderWithMessage: React.FC<LoaderProps> = ({ loading, loaderText }) => {
  return (
    <Modal
      transparent
      animationType="none"
      visible={loading}
      // visible={true}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            size="large"
            // color={COLORS.primary}
          />
          <Text style={{ marginTop: 12,textAlign:'center' }}>{loaderText}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 220,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoaderWithMessage;
