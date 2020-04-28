//Imports
import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import BoxTextInput from "cuervo/src/components/BoxTextInput";
import Checkbox from "cuervo/src/components/Checkbox";
import NormalAlert from "cuervo/src/components/NormalAlert";
import LoadingViewModal from "cuervo/src/components/LoadingViewModal";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import * as Auth from "cuervo/src/api/Auth";
import { AppContext } from "cuervo/src/AppContext";
import * as Functions from "cuervo/src/utils/Functions";

//Code
export default class LoginScreen extends React.Component {
    static contextType = AppContext;

    componentDidMount() {
        this.keyboard.setTextInput(this.textInputEmail);
    }

    async onKeyboardButtonPressed(textInput, buttonType) {
        switch(textInput) {
            case this.textInputEmail: {
                switch(buttonType) {
                    case KeyboardButtonsTypes.BACK: {
                        this.props.navigation.goBack();
                        break;
                    }
                    case KeyboardButtonsTypes.NEXT: {
                        this.keyboard.setTextInput(this.textInputPassword);
                        this.keyboard.setKeyboardType(KeyboardTypes.NORMAL);
                        this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]]);
                        break;
                    }
                }
                break;
            }
            case this.textInputPassword: {
                switch(buttonType) {
                    case KeyboardButtonsTypes.BACK: {
                        this.keyboard.setTextInput(this.textInputEmail);
                        this.keyboard.setKeyboardType(KeyboardTypes.EMAIL);
                        this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]]);
                        break;
                    }
                    case KeyboardButtonsTypes.CONTINUE: {
                        
                        if(this.textInputEmail.state.text == "" || this.textInputPassword.state.text == "") {
                            this.alert.setAlertVisible(true, i18n.t("auth.login.error_alert_title"), i18n.t("auth.login.empty_fields_alert_message"));
                        }
                        else {
                            const account = {
                                email: this.textInputEmail.state.text,
                                password: this.textInputPassword.state.text
                            };

                            var validated = true;
                            if(!Functions.isValidEmail(account.email)) {
                                this.textInputEmail.setError(i18n.t("auth.login.invalid_email_text_input_error"));
                                validated = false;
                            }
                            if(account.password.length <= Definitions.PASSWORD_MIN_LENGTH) {
                                this.textInputPassword.setError(i18n.t("auth.login.invalid_password_text_input_error"));
                                validated = false;
                            }
 
                            if(validated) {
                                this.loadingViewModal.setVisible(true);
                                const data = await Auth.login(account);
                                if(data) {
                                    this.context.funcs.login(data, this.checkbox.state.checked);
                                }
                                else {
                                    this.loadingViewModal.setVisible(false);
                                    this.alert.setAlertVisible(true, i18n.t("auth.login.error_alert_title"), i18n.t("auth.login.login_error_alert_message"));
                                }
                            }
                        }
                        break;
                    }
                }
                break;
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
                            <Text style={ Styles.titleText }>{ i18n.t("auth.login.login_text") }</Text>
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
                                    keboardType={ KeyboardTypes.EMAIL }
                                    buttonsType={ [KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]] }
                                    onButtonPress={ (textInput, buttonType) => this.onKeyboardButtonPressed(textInput, buttonType) }
                                />
                            </View>
                            <View style={{
                                flex: 55,
                                flexDirection: "column",
                                marginLeft: Definitions.DEFAULT_MARGIN,
                            }}>
                                <View style={{
                                    flex: 1
                                }}>
                                    <BoxTextInput
                                        ref={ component => this.textInputEmail = component }
                                        placeholder={ i18n.t("auth.login.email_placeholder") }
                                        maxLength={ 64 }
                                    />
                                    <BoxTextInput
                                        ref={ component => this.textInputPassword = component }
                                        placeholder={ i18n.t("auth.login.password_placeholder") }
                                        secureTextEntry={ true }
                                        maxLength={ 20 }
                                    />
                                </View>
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    marginBottom: Definitions.DEFAULT_MARGIN + (Definitions.DEFAULT_MARGIN / 2)
                                }}>
                                    <Checkbox ref={ component => this.checkbox = component } checked={ true }>{ i18n.t("auth.login.autoconnect_checkbox") }</Checkbox>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 25 }}/>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}