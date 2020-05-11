//Imports
import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import Keyboard, { KeyboardTypes, KeyboardButtonsTypes } from "cuervo/src/components/Keyboard";
import Definitions, { STORAGE_KEYS } from "cuervo/src/utils/Definitions";
import Styles from "cuervo/src/utils/Styles";
import BoxTextInput from "cuervo/src/components/BoxTextInput";
import NormalAlert from "cuervo/src/components/NormalAlert";
import Checkbox from "cuervo/src/components/Checkbox";
import { AppContext } from "cuervo/src/AppContext";
import LoadingView from "cuervo/src/components/LoadingView";
import { setStateIfMounted } from "cuervo/src/utils/Functions";
import i18n from "i18n-js";

export default class SelectServerScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.server = "";
        this.state = { loading: true };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getStoredServer();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.loading != this.state.loading && !this.state.loading) {
            this.keyboard.setTextInput(this.textInputServer);
        }
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

    async getStoredServer() {
        const server = await AsyncStorage.getItem(STORAGE_KEYS.SERVER);
        if(server !== null) {
            this.context.funcs.tryConnection(server);
        }
        else {
            this.setState({ loading: false });   
        }
    }

    onKeyboardButtonPressed(textInput, buttonType) {
        if(textInput == this.textInputServer && buttonType == KeyboardButtonsTypes.CONTINUE) {
            this.server = this.textInputServer.state.text;
            if(this.server.length <= 0) {
                this.alert.setAlertVisible(true, i18n.t("select_server.select_server.error_alert_title"), i18n.t("select_server.select_server.empty_field_alert_message"));
            }
            else {
                if(this.server.slice(-1) == "/") {
                    this.server = this.server.slice(0, -1); 
                }
                const remember = this.checkbox.state.checked;
                setStateIfMounted(this, { loading: true }, () => {
                    this.context.funcs.tryConnection(this.server, remember);
                });
            }
        }
    }

    render() {
        if(this.state.loading) {
            return <LoadingView/>;
        }

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
                            <Text style={ Styles.titleText }>{ i18n.t("select_server.select_server.title") }</Text>
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
                                    buttonsType={ [KeyboardButtonsTypes.CONTINUE] }
                                    onButtonPress={ (textInput, buttonType) => this.onKeyboardButtonPressed(textInput, buttonType) }
                                />
                            </View>

                            <View style={{
                                flex: 55,
                                marginLeft: Definitions.DEFAULT_MARGIN,
                                flexDirection: "column"
                            }}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center"
                                    }}
                                >
                                    <BoxTextInput
                                        ref={ component => this.textInputServer = component }
                                        placeholder={ i18n.t("select_server.select_server.placeholder") }
                                        maxLength={ 255 }
                                        text={ this.server }
                                    />
                                </View>
                                <View style={{
                                    justifyContent: "flex-end",
                                    marginBottom: Definitions.DEFAULT_MARGIN + (Definitions.DEFAULT_MARGIN / 2)
                                }}>
                                    <Checkbox ref={ component => this.checkbox = component } checked={ true }>{ i18n.t("select_server.select_server.remember_checkbox") }</Checkbox>
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