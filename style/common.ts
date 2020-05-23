import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    color: "#333",
    margin: 10,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 24,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: "#c4c4c4",
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 18,
  },
  label: {
    color: "#333",
    fontSize: 16,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  button: {
    fontSize: 16,
    backgroundColor: "#144568",
    borderRadius: 4,
  },
  actionBar: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    marginHorizontal: 0,
    // paddingHorizontal: 0,
    width: "auto",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginHorizontal: 12,
    marginVertical: 0,
  },
});

export default styles;
