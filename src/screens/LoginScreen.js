//Imports
import React, { Component } from "react";
import { ActivityIndicator, View, Text } from "react-native";

//Styles Imports
import StartStyles from "../styles/StartStyles";

//Code
export default class LoginScreen extends Component {
    render() {
        return (
            <View style={StartStyles.container}>
                <Text style={[StartStyles.normalText, { margin: 10 }]}>¡Bienvenido!</Text>
                <ActivityIndicator size="large" color="#EE0000"/>
            </View>
        );
    }
}