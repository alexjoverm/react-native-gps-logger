import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const Record = ({ trackingRunning, onClick }) => (
  <View style={styles.record}>
    <Button title={ trackingRunning ? "Stop Recording" : "Record GPS"} color="#239800" onPress={onClick} />
  </View>
);

const styles = StyleSheet.create({
  record: {
    flex: 1,
    padding: 25,
  },
});

export default Record;
