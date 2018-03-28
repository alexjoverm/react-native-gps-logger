import React from "react";
import { StyleSheet, Text, View, Alert, Button } from "react-native";

import Stats from "./Stats";
import Record from "./Record";
import tracking from "./tracking";

export default class App extends React.Component {
  state = {
    trackingRunning: false,
    latitude: "--",
    longitude: "--",
    distance: "--",
    accuracy: "--",
    cog: "--",
    speed: "--",
  };

  componentDidMount() {
    tracking.init({
      onUnauthorized: this.onUnauthorized,
      onLocation: this.onLocation,
      onStart: this.onStart,
      onStop: this.onStop,
    });

    tracking.checkStatus(status =>
      this.setState({ trackingRunning: status.isRunning }),
    );
  }
  componentWillUnmount() {
    tracking.destroy();
  }

  onStart = () => this.setState({ trackingRunning: true });
  onStop = () => this.setState({ trackingRunning: false });

  onLocation = location =>
    this.setState({
      latitude: location.latitude.toFixed(4),
      longitude: location.longitude.toFixed(4),
      accuracy: location.accuracy.toFixed(2),
      speed: location.speed.toFixed(2),
    });

  onUnauthorized = status =>
    Alert.alert(
      "App requires location tracking permission",
      "Would you like to open app settings?",
      [
        { text: "Yes", onPress: () => tracking.showAppSettings() },
        { text: "No", onPress: () => null, style: "cancel" },
      ],
    );

  handleRecordClick = () => {
    tracking.checkStatus(status => {
      this.setState({ trackingRunning: status.isRunning });

      if (status.isRunning) {
        tracking.stop(locations => console.log(locations));
      } else {
        tracking.start();
      }
    });
  };

  render() {
    const {
      latitude,
      longitude,
      distance,
      accuracy,
      cog,
      speed,
      trackingRunning,
    } = this.state;

    return (
      <View style={styles.home}>
        <Stats
          latitude={latitude}
          longitude={longitude}
          distance={distance}
          accuracy={accuracy}
          cog={cog}
          speed={speed}
        />
        <Record
          trackingRunning={trackingRunning}
          onClick={this.handleRecordClick}
        />

        {/* Debug */}
        <Button
          title="Check number files"
          onPress={() =>
            tracking.getValidLocations(locations =>
              Alert.alert(`Locations: ${locations.length}`),
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notification: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "red",
    textAlign: "center",
    color: "white",
    padding: 5,
  },
});
