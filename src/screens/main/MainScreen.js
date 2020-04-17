//Imports
import React from "react";
import { View, Text } from "react-native";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";

//Code
export default class MainScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.account = this.context[1];
        this.profile = this.context[2];
        this.setState({ loading: false });
    }

    render() {
        return (
            this.state.loading ? (
                <LoadingView/>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Definitions.PRIMARY_COLOR
                    }}
                >
                    <Text style={ Styles.titleText }>MainScreen</Text>
                    <Text style={ Styles.normalText }>{ "account: " + this.account.email }</Text>
                    <Text style={ Styles.normalText }>{ "profile: " + this.profile.name }</Text>
                    <View style={{ height: 20 }}/>
                    <NormalButton
                        hasTVPreferredFocus={ true }
                        onPress={
                            () => {
                                this.setState({ loading: true });
                                this.context[0].profileLogOut();
                            }
                        }
                    >
                        CAMBIAR PERFIL
                    </NormalButton>
                    <NormalButton
                        onPress={
                            () => {
                                this.setState({ loading: true });
                                this.context[0].logOut();
                            }
                        }
                    >
                        CERRAR SESIÓN
                    </NormalButton>
                </View>
            )
        );
    }
}