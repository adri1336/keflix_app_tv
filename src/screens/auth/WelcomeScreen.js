//Imports
import React from "react";
import { View, Text } from "react-native";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default () => {
    return (
        <View style={[{ backgroundColor: Definitions.PRIMARY_COLOR }, Styles.centeredContainer]}>
            <Text style={[{ color: Definitions.TEXT_COLOR }, Styles.titleText]}>¡Bienvenido!</Text>
        </View>
    );
}