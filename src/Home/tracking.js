import BackgroundGeolocation from "react-native-mauron85-background-geolocation";

export const ACTIVITY_PROVIDER = BackgroundGeolocation.ACTIVITY_PROVIDER;
export const DISTANCE_FILTER_PROVIDER =
  BackgroundGeolocation.DISTANCE_FILTER_PROVIDER;

export const trackingConfigs = {
  walk: {
    stationaryRadius: 5,
    distanceFilter: 1,
    interval: 2000,
    desiredAccuracy: 1,
  },
  bike: {
    stationaryRadius: 25,
    distanceFilter: 20,
    interval: 5000,
    desiredAccuracy: 5,
  },
  car: {
    stationaryRadius: 60,
    distanceFilter: 50,
    interval: 5000,
    desiredAccuracy: 200,
  },
};

const defaultConfig = {
  // desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
  // stationaryRadius: 50,
  debug: true, // false
  distanceFilter: 50, // 500, m
  interval: 5000, // 60000, ms, android only
  locationProvider: DISTANCE_FILTER_PROVIDER,
  maxLocations: 10000,
  notificationText: "GPS location is being recorded", // android only
  notificationTitle: "Boatly route", // android only
  stopOnTerminate: false, // true
  // saveBatteryOnBackground: false // ios only
  // url: "http://192.168.81.15:3000/location",
  // httpHeaders: {
  //   "X-FOO": "bar",
  // },
  // postTemplate: {
  //   lat: "@latitude",
  //   lon: "@longitude",
  //   foo: "bar", // you can also add your own properties
  // },
};

export default new class {
  config = {};

  configure(config) {
    this.config = { ...defaultConfig, ...config };
    BackgroundGeolocation.configure(this.config, () => {
      BackgroundGeolocation.getConfig(config =>
        console.log("CCConfig", config),
      );
    });
  }

  init(config = {}) {
    const {
      onUnauthorized,
      onLocation,
      onStart,
      onStop,
      ...restConfig
    } = config;

    this.configure(restConfig);

    BackgroundGeolocation.on("location", location => {
      this._log("[BackgroundGeolocation] Location", location);
      onLocation(location);
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      // BackgroundGeolocation.startTask(taskKey => {
      //   // execute long running task
      //   // eg. ajax post location
      //   // IMPORTANT: task has to be ended by endTask
      //   BackgroundGeolocation.endTask(taskKey);
      // });
    });

    BackgroundGeolocation.on("authorization", status => {
      this._log("[BackgroundGeolocation] Auth status: " + status);

      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(onUnauthorized.bind(status), 1000);
      }
    });

    BackgroundGeolocation.on("stationary", location => {
      this._log("[BackgroundGeolocation] Stationary location:", location);
      onLocation(location);
    });

    BackgroundGeolocation.on("error", error => {
      this._log("[BackgroundGeolocation] Error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      this._log("[BackgroundGeolocation] Started");
      onStart();
    });

    BackgroundGeolocation.on("stop", () => {
      this._log("[BackgroundGeolocation] Stopped");
      onStop();
    });
  }

  start() {
    this.clean(() => this.resume(), error => this._log(error));
  }

  stop(cb) {
    this.pause();
    this.getLocations(cb);
  }

  pause() {
    BackgroundGeolocation.stop();
  }

  resume() {
    BackgroundGeolocation.start();
  }

  getLocations(cb) {
    BackgroundGeolocation.getLocations(cb);
  }

  getValidLocations(cb) {
    BackgroundGeolocation.getValidLocations(cb);
  }

  clean(cb) {
    BackgroundGeolocation.deleteAllLocations(cb, err =>
      this._log("Error deleting", err),
    );
  }

  destroy() {
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event),
    );
  }

  showAppSettings() {
    BackgroundGeolocation.showAppSettings();
  }

  checkStatus(cb) {
    BackgroundGeolocation.checkStatus(status => {
      this._log("[BackgroundGeolocation] Service is running", status.isRunning);
      this._log(
        "[BackgroundGeolocation] Services enabled",
        status.locationServicesEnabled,
      );
      this._log("[BackgroundGeolocation] Auth status: " + status.authorization);

      cb && cb(status);
    });
  }

  _log(...params) {
    console.log(this.config.debug);
    console.log(...params);
    if (this.config.debug) {
      console.log(...params);
    }
  }
}();
