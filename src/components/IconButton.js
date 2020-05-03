//Imports
import React from "react";
import { Text, View } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Other Imports
import Styles from "cuervo/src/utils/Styles";
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Code
export default class NormalButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
        if(this.props?.hasTVPreferredFocus) {
            this.state.focused = true;
        }
    }

    renderIcon() {
        if(this.props.icon) {
            return (
                <this.props.icon.library
                    name={ this.props.icon.name }
                    size={ this.props.size || Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE) }
                    color={ this.state.focused ? Definitions.TEXT_COLOR : "rgba(255, 255, 255, 0.4);" }
                />
            );
        }
    }

    renderText() {
        if(this.props.text && this.state.focused) {
            return (
                <View
                    style={{
                        width: 500,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        bottom: -20
                    }}
                >
                    <Text style={ this.props.textStyle ? this.props.textStyle : Styles.normalText }>{ this.props.text.toUpperCase() }</Text>
                </View>
            );
        }
    }
    
    render () {
        const { children, ...rest } = this.props;
        return (
            <TouchableOpacityFix
                { ...rest }
                style={[
                    this.props.style,
                    {
                        alignItems: "center"
                    }
                ]}
                focused={ this.state.focused }
                activeOpacity={ 1.0 }
                onFocus={
                    () => {
                        if(this.props?.onFocus) {
                            this.props.onFocus();
                        }
                        this.setState({ focused: true });
                    }
                }
                onBlur={
                    () => {
                        if(this.props?.onBlur) {
                            this.props.onBlur();
                        }
                        this.setState({ focused: false });
                    }
                }
            >
                { this.renderIcon() }
                { this.renderText() }
            </TouchableOpacityFix>
        );
    }
}