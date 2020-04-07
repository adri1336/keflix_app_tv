//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import Definitions, { NAVIGATORS } from "cuervo/src/utils/Definitions";
import * as HttpClient from "cuervo/src/utils/HttpClient";

//Code
export default () => {
    const { changeNavigator } = React.useContext(AppContext);
    const [connecting, setConnecting] = React.useState(true);

    if(connecting) {
        HttpClient.get("http://" + Definitions.SERVER_IP + "/checkcon").then(([response, data, error]) => {
            if(error == null && response.status == 200 && data == true) {
                changeNavigator(NAVIGATORS.AUTH);
            }
            else {
                setConnecting(false);
            }
        });
    }

    return (
        connecting ? (
            <LoadingView/>
        ) : (
            <View style={[{ backgroundColor: Definitions.PRIMARY_COLOR }, Styles.centeredContainer]}>
                <Text style={[{ color: Definitions.TEXT_COLOR }, Styles.titleText]}>{ i18n.t("connect.connect_error_text") }</Text>
                <NormalButton
                    onPress={
                        () => {
                            setConnecting(true);
                        }
                    }
                >{ (i18n.t("connect.retry_connect_button")).toUpperCase() }</NormalButton>
            </View>
        )
    );
}