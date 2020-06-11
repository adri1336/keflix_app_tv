//Imports
import React from "react";
import { Modal, View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import BoxButton from "app/src/components/BoxButton";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import { setStateIfMounted } from "app/src/utils/Functions";

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

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        if(this.state.alertVisible) {
            this.setAlertVisible(false);
        }
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    setAlertVisible(visible, title = null, message = null) {
        setStateIfMounted(this, {
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
                        minWidth: 300,
                        maxWidth: 400,
                        minHeight: 100,
                        maxHeight: 200,
                        borderRadius: 1,
                        padding: Definitions.DEFAULT_MARGIN,
                        backgroundColor: "rgba(50, 50, 50, 1.0);"
                    }}>
                        <Text style={ Styles.bigText }>{ this.state.title }</Text>
                        <View style={{ height: Definitions.DEFAULT_MARGIN / 2 }}/>
                        <Text style={ Styles.normalText }>{ this.state.message }</Text>
                        <View style={{ height: Definitions.DEFAULT_MARGIN / 2 }}/>
                        <View style={{
                            justifyContent: "flex-end",
                            alignItems: "flex-end"
                        }}>
                            <BoxButton
                                style={{
                                    marginTop: Definitions.DEFAULT_MARGIN
                                }}
                                accessibilityViewIsModal={ true }
                                hasTVPreferredFocus={ true }
                                nativeOnPress={ true }
                                onPress={ () => this.setAlertVisible(false) }
                            >{ i18n.t("normal_alert.close_button").toUpperCase() }</BoxButton>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}