//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import Definitions from "cuervo/src/utils/Definitions";
import * as Auth from "cuervo/src/api/Auth";

//Code
export default class ConnectScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            connecting: true
        };
    }

    componentDidMount() {
        if(this.state.connecting) {
            this.tryConnection();
        }
    }

    async tryConnection() {
        if(await Auth.connection) {
            this.context.funcs.connect();
        }
        else {
            this.setState({ connecting: false });
        }
    }

    render () {
        return (
            this.state.connecting ? (
                <LoadingView/>
            ) : (
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}>
                    <Text style={Styles.titleText}>{ i18n.t("connect.connect.connect_error_text") }</Text>
                    <NormalButton
                        hasTVPreferredFocus={ true }
                        onPress={
                            () => {
                                this.setState({ connecting: true });
                                this.tryConnection();
                            }
                        }
                    >{ (i18n.t("connect.connect.retry_connect_button")).toUpperCase() }</NormalButton>
                </View>
            )
        );
    }
}