//Imports
import React from "react";
import { View, ActivityIndicator } from "react-native";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default () => {
    return (
        <View style={[{ backgroundColor: Definitions.PRIMARY_COLOR }, Styles.centeredContainer]}>
            <ActivityIndicator size="large" color={Definitions.SECONDARY_COLOR}/>
        </View>
    );
}