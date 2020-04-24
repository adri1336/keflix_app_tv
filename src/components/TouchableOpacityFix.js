/*
    Por alguna razón el onPress de los componentes Touchables son llamados 3 veces
    en Android TV, le pasa a más gente: https://github.com/facebook/react-native/issues/27937
*/
//Imports
import React from "react";
import { TouchableOpacity, TVEventHandler } from "react-native";

var buttons = [];
export function enableAllButtons() {
    buttons.map((button) => {
        button.enableButton();       
    });
}

export function disableAllButtons() {
    buttons.map((button) => {
        button.disableButton();       
    });
}

//Code
export default class TouchableOpacityFix extends React.Component {
    constructor(props) {
        super(props);
        this.focused = this.props?.focused ? this.props.focused : false;
        this.state = {
            enabled: true
        };
        this.onLongPressed = false;
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler && !this.props?.nativeOnPress) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(this.focused && evt && evt.eventType == "select") {
                    if(evt.eventKeyAction >= 0) {
                        if(evt.eventKeyAction == 0) {
                            if(this.lastEventKeyAction == evt.eventKeyAction) {
                                if(this.props?.onLongPress && !this.onLongPressed) {
                                    this.onLongPressed = true;
                                    this.props.onLongPress();
                                }
                            }
                        }
                        else if(evt.eventKeyAction == 1) {
                            this.onLongPressed = false;
                            if(this.props?.onPress) {
                                this.props.onPress();
                            }
                        }
                        this.lastEventKeyAction = evt.eventKeyAction;
                    }
                }
            });
        }
    }

    disableTVEventHandler() {
        if(this.tvEventHandler) {
            this.tvEventHandler.disable();
        }
    }

    componentDidMount() {
        buttons.push(this);
        this.enableTVEventHandler();
    }

    componentWillUnmount() {
        const index = buttons.indexOf(this);
        if(index !== -1) {
            buttons.splice(index, 1);
        }
        this.disableTVEventHandler();
    }

    enableButton() {
        if(this.props?.hasTVPreferredFocus) {
            if(this.props?.onFocus) {
                this.props.onFocus();
            }
            this.focused = true;
        }
        this.setState({ enabled: true });
    }

    disableButton() {
        if(!this.props?.alwaysAccessible) {
            if(this.focused) {
                if(this.props?.onBlur) {
                    this.props.onBlur();
                }
                this.focused = false;
            }
            this.setState({ enabled: false });
        }
    }

    render () {
        const { children, ...rest } = this.props;
        return (
            <TouchableOpacity
                { ...rest }
                ref={ this.props.touchableRef }
                accessible={ this.props?.alwaysAccessible ? true : this.state.enabled }
                onPress={
                    () => {
                        if(this.state.enabled && this.props.nativeOnPress && this.props.onPress) {
                            this.props.onPress();
                        }
                    }
                }
                onFocus={
                    () => {
                        if(this.state.enabled) {
                            if(this.props?.onFocus) {
                                this.props.onFocus();
                            }
                            this.focused = true;
                        }
                    }
                }
                onBlur={
                    () => {
                        if(this.state.enabled) {
                            if(this.props?.onBlur) {
                                this.props.onBlur();
                            }
                            this.focused = false;
                        }
                    }
                }
            >
                { children }
            </TouchableOpacity>
        );
    }
}