import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageSlider from 'react-native-image-slider';
import AwesomeButton from "react-native-really-awesome-button";

export default class LandingPage extends React.Component {

    render() {
        const carouselImages = [
            require('../../../assets/pointer.png'),
            require('../../../assets/tick.png'),
            require('../../../assets/pointer.png')
        ];

        return (
            <View style={styles.container}>
                <Text>This is the top text for the view</Text>
                <ImageSlider images={carouselImages} style={{ height: 300, flex: 0 }} />
                <AwesomeButton backgroundColor={"#42a7f4"} onPress={() => this.props.navigation.navigate("SignUp")}>Get Started</AwesomeButton>
                <AwesomeButton backgroundColor={"#42a7f4"} onPress={() => this.props.navigation.navigate("Login")}>Login</AwesomeButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
