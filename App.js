import React from "react";
import Home from "./src/Home";
import { StyleSheet, Text, View } from "react-native";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, backgroundColor: "powderblue" }} />
        <View style={{ flex: 2, backgroundColor: "skyblue" }} />
        <View style={{ flex: 3, backgroundColor: "steelblue" }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
    // alignItems: "center",
    // justifyContent: "center"
  }
});
