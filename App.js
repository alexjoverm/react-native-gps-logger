import React from "react";
import Home from "./src/Home";
import { StyleSheet, Platform, View } from "react-native";

export default () => (
  <View style={styles.app}>
    <Home />
  </View>
);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    paddingTop: 20
  }
});
