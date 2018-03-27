import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Stats = ({ latitude, longitude, accuracy, distance, cog, sog }) => (
  <View style={styles.stats}>
    <View style={styles.stat}>
      <Text style={styles.statTitle}>Latitude</Text>
      <Text style={styles.statValue}>{latitude}</Text>
    </View>
    <View style={styles.stat}>
      <Text style={styles.statTitle}>Longitude</Text>
      <Text style={styles.statValue}>{longitude}</Text>
    </View>
    <View style={styles.row}>
      <View style={styles.stat}>
        <Text style={styles.statTitle}>COG</Text>
        <Text style={styles.statValue}>{cog}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.statTitle}>SOG</Text>
        <Text style={styles.statValue}>{sog}</Text>
      </View>
    </View>

    <View style={styles.row}>
      <View style={styles.stat}>
        <Text style={styles.statTitle}>Accuracy</Text>
        <Text style={styles.statValue}>{accuracy}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.statTitle}>Distance</Text>
        <Text style={styles.statValue}>{distance}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  stats: {
    flex: 1.5,
    // backgroundColor: "powderblue"
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
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

export default Stats;
