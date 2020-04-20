//Imports
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class ProfileButtonItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: this.props.focused ? this.props.focused : false
        };
    }

    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", margin: Definitions.DEFAULT_MARGIN }}>
                <TouchableOpacityFix
                    focused={ this.state.focused }
                    hasTVPreferredFocus={ this.props.hasTVPreferredFocus }
                    style={[
                        {
                            borderRadius: 1,
                            borderWidth: 2,
                            width: 140,
                            height: 140,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: this.props.profile.color,
                            marginBottom: Definitions.DEFAULT_MARGIN
                        },
                        this.state.focused ? { borderColor: "white" } : { borderColor: "rgba(255, 255, 255, 0.1);" }
                    ]}
                    activeOpacity={ 1.0 }
                    onPress={
                        () => {
                            if(this.props.onPress && this.props.profile) {
                                this.props.onPress(this.props.profile);
                            }
                        }
                    }
                    onFocus={
                        () => {
                            this.setState({ focused: true });
                        }
                    }
                    onBlur={
                        () => {
                            this.setState({ focused: false });
                        }
                    }
                >
                    <Feather name={ this.props.profile.id == 0 ? "user-plus" : "user" } size={ 70 } color="white"/>
                </TouchableOpacityFix>
                <Text
                    style={[
                        Styles.normalText,
                        this.state.focused ? { fontWeight: "bold" } : { fontWeight: "normal" }
                    ]}
                >{ this.props.profile.name.toUpperCase() }</Text>
            </View>
        );
    }
}