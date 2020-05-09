//Imports
import React from "react";
import { Modal, View, ActivityIndicator } from "react-native";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { setStateIfMounted } from "cuervo/src/utils/Functions";

//Code
export default class LoadingViewModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        if(this.state.visible) {
            this.setVisible(false);
        }
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    setVisible(toggle) {
        setStateIfMounted(this, { visible: toggle });
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={ true }
                visible={ this.state.visible }
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.8);"
                }}>
                    <ActivityIndicator size="large" color={Definitions.SECONDARY_COLOR}/>
                </View>
            </Modal>
        );
    }
}