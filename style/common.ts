import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 0,
  },
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
  textAreaContainer: {
    borderColor: "#c4c4c4",
    padding: 5,
    borderWidth: 2,
    borderRadius: 4,
  },
  textArea: {
    height: 125,
    justifyContent: "flex-start",
    textAlignVertical: "top",
    fontSize: 16,
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
    width: "auto",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginHorizontal: 12,
    marginVertical: 0,
  },
  message: {
    fontStyle: "italic",
    textAlign: "center",
    margin: 20,
  },
  section: {
    marginVertical: 20,
  },
});

export default styles;
