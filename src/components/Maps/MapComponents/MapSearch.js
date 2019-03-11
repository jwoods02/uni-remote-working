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
      <View>
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
            // console.log(data);
            this.props.updateRegionFromSearch(
              details.geometry.location.lat,
              details.geometry.location.lng
            );
            console.log("");
            console.log(details.geometry.location.lat);
            console.log("");
            console.log(details.geometry.location.lng);
          }}
          getDefaultValue={() => ""}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: "AIzaSyAGClhC6A6eBTqO1TSv8AHNsa-HR7efZnM",
            language: "en", // language of the results
            types: "(cities)" // default: 'geocode'
          }}
          styles={searchInputStyle}
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
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
      </View>
    );
  }
}

const searchInputStyle = {
  container: {
    backgroundColor: "#fff",
    width: 200,
    marginTop: 20,
    marginBottom: 0,
    opacity: 0.7,
    borderRadius: 8
  },
  description: {
    fontWeight: "bold",
    color: "#007",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    opacity: 0.9
  },
  predefinedPlacesDescription: {
    color: "#355"
  },
  textInputContainer: {
    height: 50,
    width: 200
  },
  textInput: {
    height: 33,
    fontSize: 16
  },
  listView: {
    color: "rgba(130,4,150, 0.9)",
    backgroundColor: "rgba(130,4,150, 0.2)"
  }
};
