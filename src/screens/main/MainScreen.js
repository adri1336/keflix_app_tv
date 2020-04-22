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
        this.account = this.context.account;
        this.profile = this.context.profile;
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
                                this.props.navigation.navigate("Screen2", {
                                    account: this.account,
                                    profile: this.profile
                                });
                            }
                        }
                    >
                        GO TO SCREEN2
                    </NormalButton>
                    <NormalButton
                        onPress={
                            () => {
                                this.props.navigation.toggleDrawer();
                            }
                        }
                    >
                        TOGGLE DRAWER
                    </NormalButton>
                    <NormalButton
                        onPress={
                            () => {
                                this.props.navigation.setOptions({
                                    title: "asdasd"
                                });
                            }
                        }
                    >
                        SET OPTIONS
                    </NormalButton>
                    <View style={{ height: 20 }}/>
                    <NormalButton
                        onPress={
                            () => {
                                this.setState({ loading: true });
                                this.context.appContext.profileLogOut();
                            }
                        }
                    >
                        CAMBIAR PERFIL
                    </NormalButton>
                    <NormalButton
                        onPress={
                            () => {
                                this.setState({ loading: true });
                                this.context.appContext.logOut();
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