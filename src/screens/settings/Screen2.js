//Imports
import React from "react";
import { View, Text } from "react-native";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";

//Code
export default class Screen2 extends React.Component {
    constructor(props) {
        super(props);
        //console.log("navigation2: ", this.props.navigation);
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: "red"
                }}
            >
                <Text>SettingsScreen 2!</Text>
                <NormalButton
                    hasTVPreferredFocus={ true }
                >HOLA!!!</NormalButton>
            </View>
        );
    }
}