//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import LoadingView from "app/src/components/LoadingView";
import NormalButton from "app/src/components/NormalButton";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import { AppContext } from "app/src/AppContext";
import Definitions from "app/src/utils/Definitions";
import * as Auth from "app/src/api/Auth";
import { setStateIfMounted } from "app/src/utils/Functions";

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
        if(await Auth.connection(this.context.state.server)) {
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
                    <View
                        style={{
                            position: "absolute",
                            bottom: 100
                        }}
                    >
                        <NormalButton
                            onPress={
                                () => {
                                    setStateIfMounted(this, { connecting: true }, () => this.context.funcs.selectNewServer());
                                }
                            }
                        >
                            { (i18n.t("connect.connect.change_server_button")).toUpperCase() }
                        </NormalButton>
                    </View>
                </View>
            )
        );
    }
}