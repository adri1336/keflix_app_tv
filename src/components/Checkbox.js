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
import * as Dimensions from "cuervo/src/utils/Dimensions.js";
import { setStateIfMounted } from "cuervo/src/utils/Functions";

//Code
export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            checked: this.props.checked ? this.props.checked : false
        };
    }

    componentDidMount() {
        this._isMounted = true;
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
    
    renderChecked() {
        if(this.state.checked) {
            return (
                <Feather name="check" size={ Dimensions.vw(1.8) } color="white" />
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
                            setStateIfMounted(this, { checked: !this.state.checked });
                        }
                    }
                    onFocus={
                        () => {
                            setStateIfMounted(this, { focused: true });
                        }
                    }
                    onBlur={
                        () => {
                            setStateIfMounted(this, { focused: false });
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