//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import Definitions from "cuervo/src/utils/Definitions";
import { _fetch } from "cuervo/src/utils/HttpClient";

//Code
export default () => {
    const context = React.useContext(AppContext);
    const [connecting, setConnecting] = React.useState(true);
    
    if(connecting) {
        (
            async () => {
                const [response, data, error] = await _fetch("/auth/connection");
                if(!error && response.status == 200) {
                    context.funcs.connect();
                }
                else {
                    setConnecting(false);
                }
            }
        )();
    }

    return (
        connecting ? (
            <LoadingView/>
        ) : (
            <View style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
                <Text style={Styles.titleText}>{ i18n.t("connect.connect.connect_error_text") }</Text>
                <NormalButton
                    hasTVPreferredFocus={ true }
                    onPress={
                        () => {
                            setConnecting(true);
                        }
                    }
                >{ (i18n.t("connect.connect.retry_connect_button")).toUpperCase() }</NormalButton>
            </View>
        )
    );
}