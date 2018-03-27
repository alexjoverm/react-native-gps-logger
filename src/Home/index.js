import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import BackgroundGeolocation from "react-native-mauron85-background-geolocation";
import Stats from "./Stats";
import Record from "./Record";

export default class App extends React.Component {
  state = {
    status: null,
    latitude: 99.77328,
    longitude: 12.5,
    distance: 15,
    accuracy: 10,
    cog: 342.238,
    sog: 889.3892,
  };

  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: "Background tracking",
      notificationText: "enabled",
      debug: true,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar",
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar", // you can also add your own properties
      },
    });

    BackgroundGeolocation.on("location", location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("stationary", stationaryLocation => {
      // handle stationary locations here
      Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on("error", error => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });

    BackgroundGeolocation.on("authorization", status => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status,
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "App requires location tracking permission",
              "Would you like to open app settings?",
              [
                {
                  text: "Yes",
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log(
        "[INFO] BackgroundGeolocation service is running",
        status.isRunning,
      );
      console.log(
        "[INFO] BackgroundGeolocation services enabled",
        status.locationServicesEnabled,
      );
      console.log(
        "[INFO] BackgroundGeolocation auth status: " + status.authorization,
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    // you can also just start without checking for status
    // BackgroundGeolocation.start();
  }

  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event),
    );
  }

  handleRecordClick = () => {
    this.setState({ status: this.state.status ? null : "Recording" });
  };

  render() {
    const {
      latitude,
      longitude,
      distance,
      accuracy,
      cog,
      sog,
      status,
    } = this.state;

    return (
      <View style={styles.home}>
        <Stats
          latitude={latitude}
          longitude={longitude}
          distance={distance}
          accuracy={accuracy}
          cog={cog}
          sog={sog}
        />
        <Record onClick={this.handleRecordClick} />
        {status && <Text style={styles.notification}>{status}</Text>}
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
