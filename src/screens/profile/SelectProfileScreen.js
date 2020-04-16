//Imports
import React from "react";
import { View, Text } from "react-native";

//Components Imports
import BoxButton from "cuervo/src/components/BoxButton";
import LoadingView from "cuervo/src/components/LoadingView";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";

//Code
export default class SelectProfileScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.account = this.context[1];
        this.setState({ loading: false });
    }

    render() {
        return (
            this.state.loading ? (
                <LoadingView/>
            ) : (
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}>
                    <Text style={ Styles.titleText }>Bienvenido, { this.account.email }</Text>
                    <BoxButton
                        textStyle={[ Styles.bigText, { paddingLeft: Definitions.DEFAULT_MARGIN * 2, paddingRight: Definitions.DEFAULT_MARGIN * 2 } ]}
                        hasTVPreferredFocus={ true }
                        onPress={
                            () => {
                                this.setState({ loading: true });
                                this.context[0].logOut();
                            }
                        }
                    >Cerrar sesión</BoxButton>
                </View>
            )
        );
    }
}