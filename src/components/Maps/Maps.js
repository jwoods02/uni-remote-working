import MapView from "react-native-maps";
import React, { Component } from "react";

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

let defaultRegion = {
  latitude: 51.481583,
  longitude: -3.17909,
  latitudeDelta: 0.04864195044303443,
  longitudeDelta: 0.040142817690068
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e)
    );
  });
};

//https://github.com/react-native-community/react-native-maps/issues/1858

class Maps extends Component {
  constructor() {
    super();
    this.state = {
      // region: defaultRegion
      region: defaultRegion
    };
  }

  componentDidMount() {
    getCurrentLocation().then(position => {
      if (position) {
        console.log("POSITION");
        console.log(position);
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
          }
        });
      }
    });
  }

  render() {
    return (
      <MapView
        showsUserLocation={true}
        style={styles.map}
        region={{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta
        }}
      />
    );
  }
}

export default Maps;

// import MapView from "react-native-maps";
// import React, { Component } from "react";

// import { StyleSheet } from "react-native";

// let defaultRegion = {
//   latitude: 45.52220671242907,
//   longitude: -122.6653281029795,
//   latitudeDelta: 0.04864195044303443,
//   longitudeDelta: 0.040142817690068
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "flex-end",
//     alignItems: "center"
//   },
//   map: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0
//   }
// });

// var mapStyle = [
//   { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
//   { elementType: "labels.icon", stylers: [{ visibility: "off" }] }
// ];

// export const getCurrentLocation = () => {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       position => resolve(position),
//       e => reject(e)
//     );
//   });
// };

// class Maps extends Component {
//   constructor() {
//     super();
//     this.state = {
//       region: defaultRegion
//     };
//   }

//   componentDidMount() {
//     return getCurrentLocation().then(position => {
//       if (position) {
//         this.setState({
//           region: {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             latitudeDelta: 0.003,
//             longitudeDelta: 0.003
//           }
//         });
//       }
//     });
//   }

// }

// export default Maps;

// // initialRegion={{
// //   latitude: 45.52220671242907,
// //   longitude: -122.6653281029795,
// //   latitudeDelta: 0.04864195044303443,
// //   longitudeDelta: 0.040142817690068
// // }}
