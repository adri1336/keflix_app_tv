//Imports
import React from "react";
import { Text, Image } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Code
export default class BoxButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
    }

    renderIcon() {
        if(this.props.icon) {
            return (
                <Image
                    style={{
                        width: Dimensions.vw(1.3),
                        height: Dimensions.vw(1.3)
                    }}
                    source={this.props.icon}
                />
            );
        }
    }
    
    render () {
        return (
            <TouchableOpacityFix
                style={[
                    this.props.style,
                    { borderRadius: 2 },
                    this.state.focused ? ( { backgroundColor: "rgba(70, 130, 180, 0.9);" } ) : ( { backgroundColor: "rgba(120, 120, 120, 0.4);" } )
                ]}
                hasTVPreferredFocus={ this.props.hasTVPreferredFocus }
                onPress={ this.props.onPress }
                activeOpacity={ 1.0 }
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
                { this.renderIcon() }
                <Text 
                    style={[
                        this.props.children ? { display: "flex" } : { display: "none" },
                        { padding: Definitions.DEFAULT_MARGIN },
                        this.props.textStyle ? this.props.textStyle : Styles.normalText,
                        this.state.focused ? ( { color: "white" } ) : ( { color: "rgba(255, 255, 255, 0.4);" } )
                    ]}>{ this.props.children }</Text>
            </TouchableOpacityFix>
        );
    }
}