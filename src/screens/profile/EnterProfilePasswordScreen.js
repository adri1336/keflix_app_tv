//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import CodeTextInput from "cuervo/src/components/CodeTextInput";
import NormalAlert from "cuervo/src/components/NormalAlert";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { NAVIGATORS } from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";

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

    onKeyboardButtonPressed(textInput, buttonType) {
        if(textInput == this.textInputPassword) {
            switch(buttonType) {
                case KeyboardButtonsTypes.BACK: {
                    this.props.navigation.goBack();
                    break;
                }
                case KeyboardButtonsTypes.CONTINUE: {
                    const password = this.textInputPassword.getCode();
                    if(password.length < Definitions.PIN_PASSWORD_LEGTH) {
                        this.alert.setAlertVisible(true, i18n.t("profile.enter_profile_password.error_alert_title"), i18n.t("profile.enter_profile_password.invalid_password_length_alert_message"));
                    }
                    else {
                        if(this.profile.password != password) {
                            this.alert.setAlertVisible(true, i18n.t("profile.enter_profile_password.error_alert_title"), i18n.t("profile.enter_profile_password.invalid_password_alert_message"));
                        }
                        else {
                            this.context[0].changeProfile(this.profile);
                            this.context[0].changeNavigator(NAVIGATORS.MAIN);
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
                                    length={ Definitions.PIN_PASSWORD_LEGTH }
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