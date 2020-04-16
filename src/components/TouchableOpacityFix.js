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
        this.lastPressedTime = 0;
        this.consecutiveTvLongPress = 0;
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                            if(this.props.onTvLongPress != null) {
                                const diff = Date.now() - this.lastPressedTime;
                                if(diff <= 350) {
                                    this.consecutiveTvLongPress ++;
                                    if(this.consecutiveTvLongPress >= 3) {
                                        this.consecutiveTvLongPress = 0;
                                        this.props.onTvLongPress();
                                    }
                                }
                                else {
                                    this.consecutiveTvLongPress = 0;
                                }
                                this.lastPressedTime = Date.now();
                            }
                            this.props.onPress();
                            setTimeout(() => {
                                if(this._isMounted) {
                                    this.setState({ disabled: false });
                                }
                            }, 200);
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