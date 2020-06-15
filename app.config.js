export default {
  name: "Journal App",
  slug: "journal-app",
  platforms: ["ios", "android", "web"],
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "myapp",
  splash: {
    image: "./assets/images/logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.mmoranmedia.journalapp",
    buildNumber: "1.0.0",
  },
  android: {
    package: "com.mmoranmedia.journalapp",
    versionCode: 1,
  },
  extra: {
    apiUrl: process.env.REACT_NATIVE_API,
  },
};
