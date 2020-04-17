//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import BoxTextInput from "cuervo/src/components/BoxTextInput";
import Checkbox from "cuervo/src/components/Checkbox";
import NormalAlert from "cuervo/src/components/NormalAlert";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class CreateProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.state = {
            repeatPasswordEnabled: false
        }
    }

    componentDidMount() {
        this.keyboard.setTextInput(this.textInputName);
    }

    onKeyboardButtonPressed(textInput, buttonType) {
        switch(textInput) {
            case this.textInputName: {
                switch(buttonType) {
                    case KeyboardButtonsTypes.BACK: {
                        this.props.navigation.goBack();
                        break;
                    }
                    case KeyboardButtonsTypes.NEXT: {
                        this.keyboard.setTextInput(this.textInputPassword);
                        this.keyboard.setKeyboardType(KeyboardTypes.NUMERIC);
                        if(this.state.repeatPasswordEnabled) {
                            this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]]);
                        }
                        else {
                            this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]]);
                        }
                        break;
                    }
                }
                break;
            }
            case this.textInputPassword: {
                switch(buttonType) {
                    case KeyboardButtonsTypes.BACK: {
                        this.keyboard.setTextInput(this.textInputName);
                        this.keyboard.setKeyboardType(KeyboardTypes.NORMAL);
                        this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]]);
                        break;
                    }
                    case KeyboardButtonsTypes.NEXT: {
                        this.keyboard.setTextInput(this.textInputRepeatPassword);
                        this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]]);
                        break;
                    }
                    case KeyboardButtonsTypes.CONTINUE: {
                        this.onContinueProfileRegisterRequest();
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
                        this.onContinueProfileRegisterRequest();
                        break;
                    }
                }
            }
        }
    }

    onContinueProfileRegisterRequest() {
        var goToColorPicker = true;

        if(this.state.repeatPasswordEnabled) {
            if(this.textInputName.state.text == "" || this.textInputPassword.state.text == "" || this.textInputRepeatPassword.state.text == "") {
                this.alert.setAlertVisible(true, i18n.t("profile.create_profile.error_alert_title"), i18n.t("profile.create_profile.empty_fields_alert_message"));
                goToColorPicker = false;
            }
            else {
                if(this.textInputPassword.state.text != this.textInputRepeatPassword.state.text) {
                    this.alert.setAlertVisible(true, i18n.t("profile.create_profile.error_alert_title"), i18n.t("profile.create_profile.passwords_no_match_alert_message"));
                    goToColorPicker = false;
                }
                else {
                    if(this.textInputPassword.state.text.length != Definitions.PIN_PASSWORD_LEGTH) {
                        this.textInputPassword.setError(i18n.t("profile.create_profile.invalid_password_text_input_error", { password_length: Definitions.PIN_PASSWORD_LEGTH }));
                        goToColorPicker = false;
                    }
                }
            }
        }
        else {
            if(this.textInputName.state.text == "") {
                this.alert.setAlertVisible(true, i18n.t("profile.create_profile.error_alert_title"), i18n.t("profile.create_profile.empty_name_alert_message"));
                goToColorPicker = false;
            }
        }

        if(goToColorPicker) {
            const profile = {
                name: this.textInputName.state.text,
                password: this.textInputPassword.state.text == "" ? null : this.textInputPassword.state.text,
                adult_content: this.adult_content_checkbox.state.checked ? 1 : 0
            };
            this.props.navigation.navigate("SelectProfileColorScreen", {
                account: this.account,
                profile: profile
            });
        }
    }

    onPasswordTextChanged(text) {
        if(this.state.repeatPasswordEnabled && text.length <= 0) {
            this.setState({ repeatPasswordEnabled: false });
            this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]]);
        }
        else if(!this.state.repeatPasswordEnabled && text.length > 0) {
            this.setState({ repeatPasswordEnabled: true });
            this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]]);
        }
    }

    renderRepeatPassword() {
        if(this.state.repeatPasswordEnabled) {
            return (
                <BoxTextInput
                    ref={ component => this.textInputRepeatPassword = component }
                    placeholder={ i18n.t("profile.create_profile.repeat_password_placeholder") }
                    secureTextEntry={ true }
                    maxLength={ Definitions.PIN_PASSWORD_LEGTH }
                />
            );
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
                            <Text style={ Styles.titleText }>{ i18n.t("profile.create_profile.create_profile_text") }</Text>
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
                                        ref={ component => this.textInputName = component }
                                        placeholder={ i18n.t("profile.create_profile.name_placeholder") }
                                        maxLength={ 24 }
                                    />
                                    <BoxTextInput
                                        ref={ component => this.textInputPassword = component }
                                        placeholder={ i18n.t("profile.create_profile.password_placeholder") }
                                        secureTextEntry={ true }
                                        maxLength={ Definitions.PIN_PASSWORD_LEGTH }
                                        onTextSet={ (text) => this.onPasswordTextChanged(text) }
                                    />
                                    {
                                        this.renderRepeatPassword()
                                    }
                                </View>
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    marginBottom: Definitions.DEFAULT_MARGIN + (Definitions.DEFAULT_MARGIN / 2)
                                }}>
                                    <Checkbox ref={ component => this.adult_content_checkbox = component }>{ i18n.t("profile.create_profile.adult_content_checkbox") }</Checkbox>
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