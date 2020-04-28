//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import CodeTextInput from "cuervo/src/components/CodeTextInput";
import NormalAlert from "cuervo/src/components/NormalAlert";
import NormalButton from "cuervo/src/components/NormalButton";
import LoadingViewModal from "cuervo/src/components/LoadingViewModal";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import * as Profile from "cuervo/src/api/Profile";

//Code
export default class EnterProfilePasswordScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.profile = this.props.route.params.profile;
    }

    componentDidMount() {
        this.keyboard.setTextInput(this.textInputPassword);
    }

    async onKeyboardButtonPressed(textInput, buttonType) {
        if(textInput == this.textInputPassword) {
            switch(buttonType) {
                case KeyboardButtonsTypes.BACK: {
                    this.props.navigation.goBack();
                    break;
                }
                case KeyboardButtonsTypes.CONTINUE: {
                    const password = this.textInputPassword.getCode();
                    if(password.length < Definitions.PIN_PASSWORD_LENGTH) {
                        this.alert.setAlertVisible(true, i18n.t("profile.enter_profile_password.error_alert_title"), i18n.t("profile.enter_profile_password.invalid_password_length_alert_message"));
                    }
                    else {
                        this.loadingViewModal.setVisible(true);
                        if(await Profile.check_password(this.context, this.profile.id, password)) {
                            this.context.funcs.profileLogin(this.profile);
                        }
                        else {
                            this.loadingViewModal.setVisible(false);
                            this.alert.setAlertVisible(true, i18n.t("profile.enter_profile_password.error_alert_title"), i18n.t("profile.enter_profile_password.invalid_password_alert_message"));
                        }
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
                            <Text style={ Styles.titleText }>{ i18n.t("profile.enter_profile_password.profile_password_text") }</Text>
                        </View>
                        <View style={{
                            flex: 50,
                            flexDirection: "row"
                        }}>
                            
                            <View style={{
                                flex: 30,
                                flexDirection: "column"
                            }}>
                                <Keyboard 
                                    ref={ component => this.keyboard = component }
                                    keboardType={ KeyboardTypes.NUMERIC }
                                    buttonsType={ [KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]] }
                                    onButtonPress={ (textInput, buttonType) => this.onKeyboardButtonPressed(textInput, buttonType) }
                                />
                            </View>
                            <View style={{
                                flex: 70,
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: Definitions.DEFAULT_MARGIN,
                            }}>
                                <CodeTextInput
                                    ref={ component => this.textInputPassword = component }
                                    length={ Definitions.PIN_PASSWORD_LENGTH }
                                    secureTextEntry={ true }
                                />
                            </View>

                        </View>
                        <View style={{ flex: 25, flexDirection: "row" }}>
                            <View style={{ flex: 30, alignItems: "center" }}>
                                <NormalButton
                                    style={{ marginTop: Definitions.DEFAULT_MARGIN }}
                                    onPress={
                                        () => {
                                            this.props.navigation.navigate("EnterAccountPasswordScreen", {
                                                account: this.account,
                                                profile: this.profile
                                            });
                                        }
                                    }
                                >
                                    { i18n.t("profile.enter_profile_password.use_account_password_button") }
                                </NormalButton>
                            </View>
                            <View style={{ flex: 70 }}/>
                        </View>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}