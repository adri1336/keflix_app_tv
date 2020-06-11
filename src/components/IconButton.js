//Imports
import React from "react";
import { Text, View } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Other Imports
import Styles from "app/src/utils/Styles";
import Definitions, { DEFAULT_SIZES } from "app/src/utils/Definitions";
import * as Dimensions from "app/src/utils/Dimensions.js";
import { setStateIfMounted } from "app/src/utils/Functions";

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
                        setStateIfMounted(this, { focused: true });
                    }
                }
                onBlur={
                    () => {
                        if(this.props?.onBlur) {
                            this.props.onBlur();
                        }
                        setStateIfMounted(this, { focused: false });
                    }
                }
            >
                { this.renderIcon() }
                { this.renderText() }
            </TouchableOpacityFix>
        );
    }
}