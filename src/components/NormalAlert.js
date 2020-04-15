//Imports
import React from "react";
import { Modal, View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import BoxButton from "cuervo/src/components/BoxButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class NormalAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertVisible: false,
            title: null,
            message: null
        };
    }

    componentWillUnmount() {
        if(this.state.alertVisible) {
            this.setAlertVisible(false);
        }
    }

    setAlertVisible(visible, title = null, message = null) {
        this.setState({
            alertVisible: visible,
            title: title,
            message: message
        });
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={ true }
                visible={ this.state.alertVisible }
                onRequestClose={ () => this.setAlertVisible(false) }
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.8);"
                }}>
                    <View style={{
                        width: 300,
                        height: 100,
                        borderRadius: 1,
                        padding: Definitions.DEFAULT_MARGIN,
                        backgroundColor: "rgba(50, 50, 50, 1.0);"
                    }}>
                        <Text style={ Styles.bigText }>{ this.state.title }</Text>
                        <View style={{ height: Definitions.DEFAULT_MARGIN / 2 }}/>
                        <Text style={ Styles.normalText }>{ this.state.message }</Text>
                        <View style={{ height: Definitions.DEFAULT_MARGIN / 2 }}/>
                        <View style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "flex-end"
                        }}>
                            <BoxButton
                                accessibilityViewIsModal={ true }
                                hasTVPreferredFocus={ true }
                                onPress={ () => this.setAlertVisible(false) }
                            >{ i18n.t("normalAlert.close_button").toUpperCase() }</BoxButton>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}