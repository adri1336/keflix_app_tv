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
import { setStateIfMounted } from "cuervo/src/utils/Functions";

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
        this._isMounted = true;
        if(this.state.connecting) {
            this.tryConnection();
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
    
    async tryConnection() {
        if(await Auth.connection()) {
            this.context.funcs.connect();
        }
        else {
            setStateIfMounted(this, { connecting: false });
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
                                setStateIfMounted(this, { connecting: true });
                                this.tryConnection();
                            }
                        }
                    >{ (i18n.t("connect.connect.retry_connect_button")).toUpperCase() }</NormalButton>
                </View>
            )
        );
    }
}