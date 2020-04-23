//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import BoxTextInput from "cuervo/src/components/BoxTextInput";
import NormalAlert from "cuervo/src/components/NormalAlert";
import NormalButton from "cuervo/src/components/NormalButton";
import LoadingViewModal from "cuervo/src/components/LoadingViewModal";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { NAVIGATORS } from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import * as HttpClient from "cuervo/src/utils/HttpClient";

//Code
export default class EnterAccountPasswordScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.profile = this.props.route.params.profile;
    }

    componentDidMount() {
        this.keyboard.setTextInput(this.textInputPassword);
    }

    onKeyboardButtonPressed(textInput, buttonType) {
        if(textInput == this.textInputPassword) {
            switch(buttonType) {
                case KeyboardButtonsTypes.BACK: {
                    this.props.navigation.goBack();
                    break;
                }
                case KeyboardButtonsTypes.CONTINUE: {
                    const password = this.textInputPassword.state.text;
                    if(password.length < Definitions.PIN_PASSWORD_LEGTH) {
                        this.alert.setAlertVisible(true, i18n.t("profile.enter_account_password.error_alert_title"), i18n.t("profile.enter_account_password.invalid_password_length_alert_message"));
                    }
                    else {
                        this.loadingViewModal.setVisible(true);

                        const account = {
                            email: this.account.email,
                            password: this.textInputPassword.state.text
                        };
                        HttpClient.post("http://" + Definitions.SERVER_IP + "/account/check_account_password", account).then(([response, data, error]) => {
                            if(error == null && response.status == 200 && data != false) {
                                this.context.appContext.changeProfile(this.profile);
                                this.context.appContext.changeNavigator(NAVIGATORS.MAIN);
                            }
                            else {
                                this.loadingViewModal.setVisible(false);
                                this.alert.setAlertVisible(true, i18n.t("profile.enter_account_password.error_alert_title"), i18n.t("profile.enter_account_password.invalid_password_alert_message"));
                            }
                        });
                    }
                    break;
                }
            }
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
                <NormalAlert ref={ component => this.alert = component }/>
                <LoadingViewModal ref={ component => this.loadingViewModal = component }/>
                <View style={{ flex: 10 }}/>
                <View style={{ flex: 80 }}>
                    
                    <View style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        
                        <View style={{
                            flex: 25,
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            marginBottom: Definitions.DEFAULT_MARGIN
                        }}>
                            <Text style={ Styles.titleText }>{ i18n.t("profile.enter_account_password.account_password_text") }</Text>
                        </View>
                        <View style={{
                            flex: 50,
                            flexDirection: "row"
                        }}>
                            
                            <View style={{
                                flex: 45,
                                flexDirection: "column"
                            }}>
                                <Keyboard 
                                    ref={ component => this.keyboard = component }
                                    keboardType={ KeyboardTypes.NORMAL }
                                    buttonsType={ [KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]] }
                                    onButtonPress={ (textInput, buttonType) => this.onKeyboardButtonPressed(textInput, buttonType) }
                                />
                            </View>
                            <View style={{
                                flex: 55,
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: Definitions.DEFAULT_MARGIN,
                            }}>
                                <BoxTextInput
                                    ref={ component => this.textInputPassword = component }
                                    placeholder={ i18n.t("profile.enter_account_password.password_placeholder") }
                                    secureTextEntry={ true }
                                    maxLength={ 20 }
                                />
                            </View>

                        </View>
                        <View style={{ flex: 25, flexDirection: "row" }}>
                            <View style={{ flex: 45, alignItems: "center" }}>
                                <NormalButton
                                    style={{ marginTop: Definitions.DEFAULT_MARGIN }}
                                    onPress={
                                        () => {
                                            this.props.navigation.navigate("EnterProfilePasswordScreen", {
                                                account: this.account,
                                                profile: this.profile
                                            });
                                        }
                                    }
                                >
                                    { i18n.t("profile.enter_account_password.use_profile_password_button") }
                                </NormalButton>
                            </View>
                            <View style={{ flex: 55 }}/>
                        </View>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}