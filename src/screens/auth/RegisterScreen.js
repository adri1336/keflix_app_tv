//Imports
import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "app/src/components/Keyboard";
import BoxTextInput from "app/src/components/BoxTextInput";
import Checkbox from "app/src/components/Checkbox";
import NormalAlert from "app/src/components/NormalAlert";
import LoadingViewModal from "app/src/components/LoadingViewModal";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import * as Auth from "app/src/api/Auth";
import { AppContext } from "app/src/AppContext";
import * as Functions from "app/src/utils/Functions";

//Code
export default class RegisterScreen extends React.Component {
    static contextType = AppContext;

    componentDidMount() {
        this._isMounted = true;
        this.keyboard.setTextInput(this.textInputEmail);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
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
                        break;
                    }
                    case KeyboardButtonsTypes.NEXT: {
                        this.keyboard.setTextInput(this.textInputRepeatPassword);
                        this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]]);
                        break;
                    }
                }
                break;
            }
            case this.textInputRepeatPassword: {
                switch(buttonType) {
                    case KeyboardButtonsTypes.BACK: {
                        this.keyboard.setTextInput(this.textInputPassword);
                        this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]]);
                        break;
                    }
                    case KeyboardButtonsTypes.CONTINUE: {
                        if(this.textInputEmail.state.text == "" || this.textInputPassword.state.text == "" || this.textInputRepeatPassword.state.text == "") {
                            this.alert.setAlertVisible(true, i18n.t("auth.register.error_alert_title"), i18n.t("auth.register.empty_fields_alert_message"));
                        }
                        else {
                            if(this.textInputPassword.state.text != this.textInputRepeatPassword.state.text) {
                                this.alert.setAlertVisible(true, i18n.t("auth.register.error_alert_title"), i18n.t("auth.register.passwords_no_match_alert_message"));
                            }
                            else {
                                const account = {
                                    email: this.textInputEmail.state.text,
                                    password: this.textInputPassword.state.text
                                };

                                var validated = true;
                                if(!Functions.isValidEmail(account.email)) {
                                    this.textInputEmail.setError(i18n.t("auth.register.invalid_email_text_input_error"));
                                    validated = false;
                                }
                                if(account.password.length <= Definitions.PASSWORD_MIN_LENGTH) {
                                    this.textInputPassword.setError(i18n.t("auth.register.invalid_password_text_input_error"));
                                    validated = false;
                                }

                                if(validated) {
                                    this.loadingViewModal.setVisible(true);
                                    const data = await Auth.register(this.context.state.server, account);
                                    if(data) {
                                        this.context.funcs.login(data, this.checkbox.state.checked);
                                    }
                                    else {
                                        this.loadingViewModal.setVisible(false);
                                        this.alert.setAlertVisible(true, i18n.t("auth.register.error_alert_title"), i18n.t("auth.register.register_error_alert_message"));
                                    }
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
                            <Text style={ Styles.titleText }>{ i18n.t("auth.register.register_text") }</Text>
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
                                        placeholder={ i18n.t("auth.register.email_placeholder") }
                                    />
                                    <BoxTextInput
                                        ref={ component => this.textInputPassword = component }
                                        placeholder={ i18n.t("auth.register.password_placeholder") }
                                        secureTextEntry={ true }
                                    />
                                    <BoxTextInput
                                        ref={ component => this.textInputRepeatPassword = component }
                                        placeholder={ i18n.t("auth.register.repeat_password_placeholder") }
                                        secureTextEntry={ true }
                                    />
                                </View>
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    marginBottom: Definitions.DEFAULT_MARGIN + (Definitions.DEFAULT_MARGIN / 2)
                                }}>
                                    <Checkbox ref={ component => this.checkbox = component } checked={ true }>{ i18n.t("auth.register.autoconnect_checkbox") }</Checkbox>
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