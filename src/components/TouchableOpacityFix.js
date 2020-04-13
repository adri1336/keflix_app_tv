/*
    Por alguna razón el onPress de los componentes Touchables son llamados 3 veces
    en Android TV, le pasa a más gente: https://github.com/facebook/react-native/issues/27937
*/
//Imports
import React from "react";
import { TouchableOpacity } from "react-native";

//Code
export default class TouchableOpacityFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
    }

    render () {
        return (
            <TouchableOpacity
                style={ this.props.style }
                hasTVPreferredFocus={ this.props.hasTVPreferredFocus }
                onPress={
                    () => {
                        if(!this.state.disabled && this.props.onPress != null) {
                            this.setState({ disabled: true });
                            this.props.onPress();
                            setTimeout(() => this.setState({ disabled: false }), 200);
                        }
                    }
                }
                activeOpacity={ this.props.activeOpacity }
                onFocus={ this.props.onFocus }
                onBlur={ this.props.onBlur }
            >{ this.props.children }</TouchableOpacity>
        );
    }
}