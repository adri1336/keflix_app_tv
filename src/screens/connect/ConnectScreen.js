//Imports
import React from "react";
import { View, ActivityIndicator } from "react-native";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import Definitions, { NAVIGATORS } from "cuervo/src/utils/Definitions";

//Code
export default () => {
    const appContext = React.useContext(AppContext);
    const { changeNavigator } = appContext;

    fetch("http://" + Definitions.SERVER_IP + "/checkcon")
    .then((response) => {
        if(response.status == 200) {
            response.json()
            .then((json) => {
                if(json == true) {
                    changeNavigator(NAVIGATORS.AUTH);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    });

    return (
        <View style={[{ backgroundColor: Definitions.PRIMARY_COLOR }, Styles.centeredContainer]}>
            <ActivityIndicator size="large" color={Definitions.SECONDARY_COLOR}/>
        </View>
    );
}