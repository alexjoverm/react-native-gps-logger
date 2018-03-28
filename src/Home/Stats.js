import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Stat from "./Stat";

const Stats = ({ latitude, longitude, accuracy, distance, cog, speed }) => (
  <View style={styles.stats}>
    <Stat label="Longitude" value={longitude} />
    <Stat label="Latitude" value={latitude} />

    <View style={styles.row}>
      <Stat label="COG" value={cog} />
      <Stat label="Speed (m/s)" value={speed} />
    </View>

    <View style={styles.row}>
      <Stat label="Accuracy" value={accuracy} />
      <Stat label="Distance" value={distance} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  stats: {
    flex: 1.5,
    // backgroundColor: "powderblue"
  },
  row: {
    flex: 1.4,
    flexDirection: "row",
  },
});

export default Stats;
