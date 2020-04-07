//Imports
import React from "react";
import { View, ActivityIndicator } from "react-native";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import Definitions, { NAVIGATORS } from "cuervo/src/utils/Definitions";
import * as HttpClient from "cuervo/src/utils/HttpClient";

//Code
export default () => {
    const { changeNavigator } = React.useContext(AppContext);

    HttpClient.get("http://" + Definitions.SERVER_IP + "/checkcon").then(([response, data, error]) => {
        if(error == null && response.status == 200 && data == true) {
            changeNavigator(NAVIGATORS.AUTH);
        }
        else {
            console.log("ERROR!");
        }
    });

    return (
        <View style={[{ backgroundColor: Definitions.PRIMARY_COLOR }, Styles.centeredContainer]}>
            <ActivityIndicator size="large" color={Definitions.SECONDARY_COLOR}/>
        </View>
    );
}