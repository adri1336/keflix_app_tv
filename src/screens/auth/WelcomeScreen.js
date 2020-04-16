//Imports
import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import i18n from "i18n-js";

//Components Imports
import BoxButton from "cuervo/src/components/BoxButton";
import LoadingView from "cuervo/src/components/LoadingView";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { NAVIGATORS, STORAGE_KEYS } from "cuervo/src/utils/Definitions";
import { name, version } from "cuervo/package.json";
import * as HttpClient from "cuervo/src/utils/HttpClient";
import { AppContext } from "cuervo/src/AppContext";

//Code
export default class WelcomeScreen extends React.Component {
    static contextType = AppContext;
    
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        if(this.state.loading) {
            (
                async () => {
                    try {
                        const email = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
                        const password = await AsyncStorage.getItem(STORAGE_KEYS.PASSWORD);
                        if(email != null && password != null) {
                            const account = {
                                email: email,
                                password: password
                            };
                            HttpClient.post("http://" + Definitions.SERVER_IP + "/account/check_account_password", account).then(([response, data, error]) => {
                                if(error == null && response.status == 200 && data != false) {
                                    this.context[0].changeAccount(data);
                                    this.context[0].changeNavigator(NAVIGATORS.PROFILE);
                                }
                                else {
                                    this.finishLoading();
                                }
                            });
                        }
                        else {
                            this.finishLoading();
                        }
                    }
                    catch(error) {
                        console.log(error);
                        this.finishLoading();
                    }

                }
            )();
        }
    }

    async finishLoading() {
        try {
            await AsyncStorage.clear();
        }
        catch(error){
            console.log(error);
        }
        finally {
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            this.state.loading ? (
                <LoadingView/>
            ) : (
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
                            <Text style={[Styles.bigTitleSlimText, { color: Definitions.SECONDARY_COLOR }]}>{ name }</Text>
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
                        <Text style={Styles.smallSlimText}>{ version }</Text>
                    </View>
                </View>
            )
        );
    }
}