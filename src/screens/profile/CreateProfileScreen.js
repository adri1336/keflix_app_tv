//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "app/src/components/Keyboard";
import BoxTextInput from "app/src/components/BoxTextInput";
import Checkbox from "app/src/components/Checkbox";
import NormalAlert from "app/src/components/NormalAlert";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import { setStateIfMounted } from "app/src/utils/Functions";

//Code
export default class CreateProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.state = { repeatPasswordEnabled: false };
        this.updating = false;
        if(this.props.route.params.profile) {
            this.updating = true;
            this.profile = this.props.route.params.profile;
            this.profile.password = null;
        }
        else {
            this.profile = {
                name: null,
                password: null,
                color: null,
                adult_content: false
            };
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.keyboard.setTextInput(this.textInputName);
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

    onKeyboardButtonPressed(textInput, buttonType) {
        switch(textInput) {
            case this.textInputName: {
                switch(buttonType) {
                    case KeyboardButtonsTypes.BACK: {
                        if(this.updating) {
                            this.props.navigation.navigate("GeneralScreen");
                        }
                        else {
                            this.props.navigation.goBack();
                        }
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
                    if(this.textInputPassword.state.text.length != Definitions.PIN_PASSWORD_LENGTH) {
                        this.textInputPassword.setError(i18n.t("profile.create_profile.invalid_password_text_input_error", { password_length: Definitions.PIN_PASSWORD_LENGTH }));
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
            this.profile.name = this.textInputName.state.text;
            this.profile.password = this.textInputPassword.state.text == "" ? null : this.textInputPassword.state.text;
            this.profile.adult_content = this.adult_content_checkbox.state.checked ? 1 : 0;
            this.props.navigation.navigate("SelectProfileColorScreen", {
                account: this.account,
                profile: this.profile
            });
        }
    }

    onPasswordTextChanged(text) {
        if(this.state.repeatPasswordEnabled && text.length <= 0) {
            setStateIfMounted(this, { repeatPasswordEnabled: false });
            this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.CONTINUE, 2]]);
        }
        else if(!this.state.repeatPasswordEnabled && text.length > 0) {
            setStateIfMounted(this, { repeatPasswordEnabled: true });
            this.keyboard.setButtons([KeyboardButtonsTypes.BACK, [KeyboardButtonsTypes.NEXT, 2]]);
        }
    }

    renderRepeatPassword() {
        if(this.state.repeatPasswordEnabled) {
            return (
                <BoxTextInput
                    ref={ component => this.textInputRepeatPassword = component }
                    text={ this.profile.password }
                    placeholder={ i18n.t("profile.create_profile.repeat_password_placeholder") }
                    secureTextEntry={ true }
                    maxLength={ Definitions.PIN_PASSWORD_LENGTH }
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
                            <Text style={ Styles.titleText }>{ !this.updating ? i18n.t("profile.create_profile.create_profile_text") : i18n.t("profile.create_profile.edit_profile_text") }</Text>
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
                                        text={ this.profile.name }
                                        placeholder={ i18n.t("profile.create_profile.name_placeholder") }
                                        maxLength={ 24 }
                                    />
                                    <BoxTextInput
                                        ref={ component => this.textInputPassword = component }
                                        text={ this.profile.password }
                                        placeholder={ i18n.t("profile.create_profile.password_placeholder") }
                                        secureTextEntry={ true }
                                        maxLength={ Definitions.PIN_PASSWORD_LENGTH }
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
                                    <Checkbox
                                        ref={ component => this.adult_content_checkbox = component }
                                        checked={ this.profile.adult_content ? true : false }
                                    >
                                        { i18n.t("profile.create_profile.adult_content_checkbox") }
                                    </Checkbox>
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