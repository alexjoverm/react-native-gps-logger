import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Stat = ({ label, value }) => {
  return (
    <View style={styles.stat}>
      <Text style={styles.statTitle}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
};

export default Stat;

const styles = StyleSheet.create({
  stat: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-around",
  },
  statTitle: {
    textAlign: "center",
    fontSize: 15,
  },
  statValue: {
    textAlign: "center",
    fontSize: 25,
  },
});
