//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import BoxButton from "cuervo/src/components/BoxButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { name, version } from "cuervo/package.json";

//Code
export default class WelcomeScreen extends React.Component {
    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
                <View style={{ flex: 10 }}/>
                <View style={{ flex: 80 }}>
                    <View style={{
                        flex: 60,
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        <Text style={[Styles.bigTitleText, { color: Definitions.SECONDARY_COLOR }]}>{ Definitions.APPLICATION_NAME }</Text>
                        <Text style={Styles.titleText}>{ i18n.t("auth.welcome.slogan_text") }</Text>
                    </View>
                    <View style={{
                        flex: 40,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                    }}>
                        <BoxButton
                            textStyle={[ Styles.bigText, { paddingLeft: Definitions.DEFAULT_MARGIN * 2, paddingRight: Definitions.DEFAULT_MARGIN * 2 } ]}
                            hasTVPreferredFocus={ true }
                            onPress={ () => this.props.navigation.navigate("RegisterScreen") }
                        >{ i18n.t("auth.welcome.register_button") }</BoxButton>
                        <View style={{ height: Definitions.DEFAULT_MARGIN }}/>
                        <BoxButton
                            textStyle={[ Styles.bigText, { paddingLeft: Definitions.DEFAULT_MARGIN * 2, paddingRight: Definitions.DEFAULT_MARGIN * 2 } ]}
                            onPress={ () => this.props.navigation.navigate("LoginScreen") }
                        >{ i18n.t("auth.welcome.login_button") }</BoxButton>
                    </View>
                </View>
                <View style={{ flex: 10, padding: 2, alignItems: "flex-end" }}>
                    <Text style={Styles.smallSlimText}>{ name + "-" + version }</Text>
                </View>
            </View>
        );
    }
}