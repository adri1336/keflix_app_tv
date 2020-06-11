//Imports
import React from "react";
import { View } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "app/src/components/Keyboard";
import BoxTextInput from "app/src/components/BoxTextInput";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import * as Account from "app/src/api/Account";
import { AppContext } from "app/src/AppContext";

//Code
export default class AccountPasswordChecker extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.account = this.props.account;
    }

    componentDidMount() {
        this._isMounted = true;
        this.keyboard.setTextInput(this.textInputPassword);
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
        if(textInput == this.textInputPassword) {
            switch(buttonType) {
                case KeyboardButtonsTypes.BACK: {
                    if(this.props.onBackRequested) {
                        this.props.onBackRequested();
                    }
                    break;
                }
                case KeyboardButtonsTypes.CONTINUE: {
                    const password = this.textInputPassword.state.text;
                    if(password.length < Definitions.PASSWORD_MIN_LENGTH) {
                        if(this.props.onInvalidPasswordLength) {
                            this.props.onInvalidPasswordLength();
                        }
                    }
                    else {
                        if(this.props.onPasswordCheckStart) {
                            this.props.onPasswordCheckStart();
                        }

                        if(await Account.check_password(this.context, password)) {
                            if(this.props.onPasswordChecked) {
                                this.props.onPasswordChecked(true);
                            }
                        }
                        else {
                            if(this.props.onPasswordChecked) {
                                this.props.onPasswordChecked(false);
                            }
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
                        placeholder={ i18n.t("account_password_checker.password_placeholder") }
                        secureTextEntry={ true }
                        maxLength={ 20 }
                    />
                </View>

            </View>
        );
    }
}