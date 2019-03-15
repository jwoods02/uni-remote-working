import React, { Component } from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default class MapSearch extends Component {
  render() {
    return (
      <View>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={"search"}
          listViewDisplayed="false"
          fetchDetails={true}
          renderDescription={row => row.description}
          onPress={(data, details = null) => {
            this.props.updateRegionFromSearch(
              details.geometry.location.lat,
              details.geometry.location.lng
            );
          }}
          getDefaultValue={() => ""}
          query={{
            key: "AIzaSyAGClhC6A6eBTqO1TSv8AHNsa-HR7efZnM",
            language: "en",
            types: "(cities)"
          }}
          styles={searchInputStyle}
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            rankby: "distance",
            types: "food"
          }}
          filterReverseGeocodingByTypes={[
            "locality",
            "administrative_area_level_3"
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200}
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
