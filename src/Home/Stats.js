import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Stat from "./Stat";

const Stats = ({ latitude, longitude, accuracy, distance, cog, speed }) => (
  <View style={styles.stats}>
    <Stat label="Longitude (°)" value={longitude} />
    <Stat label="Latitude (°)" value={latitude} />

    <View style={styles.row}>
      <Stat label="COG (°)" value={cog} />
      <Stat label="Speed (kn)" value={speed} />
    </View>

    <View style={styles.row}>
      <Stat label="Accuracy (m)" value={accuracy} />
      <Stat label="Distance (m)" value={distance} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  stats: {
    height: 300,
    // backgroundColor: "powderblue"
  },
  row: {
    flex: 1.4,
    flexDirection: "row",
  },
});

export default Stats;
