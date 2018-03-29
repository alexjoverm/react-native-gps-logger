import React from "react";
import {
  StyleSheet,
  AppState,
  Text,
  View,
  Alert,
  Picker,
  Button,
} from "react-native";

import Stats from "./Stats";
import Record from "./Record";
import tracking, { trackingConfigs } from "./tracking";
import { toKnots, stateFromLocation } from "./utils";

const getDefaultState = () => ({
  latitude: "--",
  longitude: "--",
  distance: "--",
  accuracy: "--",
  cog: "--",
  speed: "--",
});

export default class App extends React.Component {
  state = {
    trackingRunning: false,
    mode: "walk",
    ...getDefaultState(),
  };

  componentDidMount() {
    tracking.init({
      onUnauthorized: this.onUnauthorized,
      onLocation: this.onLocation,
      onStart: this.onStart,
      onStop: this.onStop,
      ...trackingConfigs[this.state.mode],
    });

    tracking.checkStatus(status =>
      this.setState({ trackingRunning: status.isRunning }),
    );

    AppState.addEventListener("change", state => {
      if (state === "active") {
        tracking.getValidLocations(locations => {
          const location = locations.pop();
          location && this.setState(stateFromLocation(location));
        });
      }
    });
  }
  componentWillUnmount() {
    tracking.destroy();
  }

  onStart = () => this.setState({ trackingRunning: true });
  onStop = () => this.setState({ trackingRunning: false });

  onLocation = location => this.setState(stateFromLocation(location));

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
        <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
          <View style={{ paddingRight: 10 }}>
            <Button
              title="See recorded positions"
              onPress={() =>
                tracking.getValidLocations(locations =>
                  Alert.alert(
                    "Locations",
                    `Total points: ${locations.length}

                  ${JSON.stringify(
                    locations.map(location => ({
                      latitude: location.latitude.toFixed(6) + "°",
                      longitude: location.longitude.toFixed(6) + "°",
                      time: new Date(location.time).toLocaleString(),
                      speed: toKnots(location.speed).toFixed(2) + "kn",
                      cog: location.bearing.toFixed(2) + "°",
                    })),
                    null,
                    2,
                  )}`,
                  ),
                )
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text>Mode: </Text>
            <Picker
              selectedValue={this.state.mode}
              onValueChange={mode => {
                this.setState({ mode });
                tracking.configure(trackingConfigs[mode]);
              }}
            >
              <Picker.Item label="Walk" value="walk" />
              <Picker.Item label="Bike" value="bike" />
              <Picker.Item label="Car" value="car" />
            </Picker>
          </View>
        </View>
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
