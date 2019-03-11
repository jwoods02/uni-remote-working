import React, { Component } from "react";
import { StyleSheet, TextInput, View, Image, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const homePlace = {
  description: "Home",
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }
};
const workPlace = {
  description: "Work",
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }
};

export default class MapSearch extends Component {
  render() {
    return (
      <View style={styles.searchBox}>
        {/* <GooglePlacesAutocomplete
          placeholder="Where to Go"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={"search"}
          renderDescription={row => row.description} // custom description render
          // styles={searchInputStyle}
        /> */}
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="false" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          getDefaultValue={() => ""}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: "AIzaSyAGClhC6A6eBTqO1TSv8AHNsa-HR7efZnM",
            language: "en", // language of the results
            types: "(cities)" // default: 'geocode'
          }}
          styles={{
            textInputContainer: {
              width: "100%"
            },
            description: {
              fontWeight: "bold"
            },
            predefinedPlacesDescription: {
              color: "rgba(130,4,150, 0.9)"
            },
            listView: {
              color: "rgba(130,4,150, 0.9)",
              backgroundColor: "rgba(130,4,150, 0.2)"
              // zIndex: 16, //To popover the component outwards
              // position: "absolute"
            }
          }}
          // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          // currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: "distance",
            types: "food"
          }}
          filterReverseGeocodingByTypes={[
            "locality",
            "administrative_area_level_3"
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          // predefinedPlaces={[homePlace, workPlace]}
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          // renderLeftButton={() => (
          //   <Image source={require("path/custom/left-icon")} />
          // )}
          // renderRightButton={() => <Text>Custom text after the input</Text>}
        />
      </View>
    );
  }
}

// const searchInputStyle = {
//   container: {
//     backgroundColor: "#fff",
//     width: "100%",
//     marginLeft: 20,
//     marginRight: 20,
//     marginTop: 20,
//     marginBottom: 0,
//     opacity: 0.9,
//     borderRadius: 8
//   },
//   description: {
//     fontWeight: "bold",
//     color: "#007",
//     borderTopWidth: 0,
//     borderBottomWidth: 0,
//     opacity: 0.9
//   },
//   predefinedPlacesDescription: {
//     color: "#355"
//   },
//   textInputContainer: {
//     height: 50
//   },
//   textInput: {
//     height: 33,
//     fontSize: 16
//   }
// };

// const styles = StyleSheet.create({
//   searchBox: {
//     top: 0,
//     position: "absolute",
//     flex: 1,
//     justifyContent: "center"
//   }
// });

const styles = StyleSheet.create({
  calloutView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    width: "40%",
    marginLeft: "30%",
    marginRight: "30%",
    marginTop: 20
  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: 0.0
  }
});
