//Imports
import React from "react";
import { View, Text, Image } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Code
export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            checked: this.props.checked ? this.props.checked : false
        };
    }

    renderChecked() {
        if(this.state.checked) {
            return (
                <Image
                    style={{
                        width: Dimensions.vw(1.8),
                        height: Dimensions.vw(1.8)
                    }}
                    source={ require("cuervo/assets/images/checkbox/checked.png") }
                />
            );
        }
    }

    render() {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <TouchableOpacityFix
                    style={[
                        {
                            width: Dimensions.vw(2.6),
                            height: Dimensions.vw(2.6),
                            borderRadius: 1,
                            borderWidth: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        this.state.focused ? { borderColor: "rgba(255, 255, 255, 1.0);" } : { borderColor: "rgba(255, 255, 255, 0.4);" }
                    ]}
                    activeOpacity={ 1.0 }
                    onPress={
                        () => {
                            this.setState({ checked: !this.state.checked });
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
                    {
                        this.renderChecked()
                    }
                </TouchableOpacityFix>
                <Text style={[ Styles.normalText, { marginLeft: Definitions.DEFAULT_MARGIN } ]}>{ this.props.children }</Text>
            </View>
        );
    }
}