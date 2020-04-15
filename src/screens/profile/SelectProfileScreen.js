//Imports
import React from "react";
import { View, Text } from "react-native";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";

//Code
export default class SelectProfileScreen extends React.Component {
    static contextType = AppContext;

    componentDidMount() {
        this.account = this.context[1];
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
                <Text style={ Styles.titleText }>Bienvenido</Text>
            </View>
        );
    }
}