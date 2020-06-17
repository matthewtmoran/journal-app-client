const expoPreset = require("jest-expo/jest-preset.js");
const jestPreset = require("@testing-library/react-native/jest-preset");

module.exports = {
  name: "Journal App",
  preset: "@testing-library/react-native",
  setupFiles: [
    ...expoPreset.setupFiles,
    ...jestPreset.setupFiles,
    "./node_modules/react-native-gesture-handler/jestSetup.js",
  ],
};
