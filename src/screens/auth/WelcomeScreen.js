//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default () => {
    return (
        <View style={[{ backgroundColor: Definitions.PRIMARY_COLOR }, Styles.centeredContainer]}>
            <Text style={[{ color: Definitions.TEXT_COLOR }, Styles.titleText]}>{ i18n.t("auth.welcome_text") }</Text>
        </View>
    );
}