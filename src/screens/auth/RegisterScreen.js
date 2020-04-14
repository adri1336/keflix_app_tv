//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import BoxTextInput from "cuervo/src/components/BoxTextInput";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class RegisterScreen extends React.Component {
    componentDidMount() {
        this.keyboard.setTextInput(this.textInputEmail);
    }

    onKeyboardButtonPressed(textInput, buttonType) {
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
                        console.log("REGISTRARSE");
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
                                marginLeft: Definitions.DEFAULT_MARGIN
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
                        </View>
                        <View style={{ flex: 25 }}/>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}