/*
    Por alguna razón el onPress de los componentes Touchables son llamados 3 veces
    en Android TV, le pasa a más gente: https://github.com/facebook/react-native/issues/27937
*/
//Imports
import React from "react";
import { TouchableOpacity, TVEventHandler } from "react-native";
import { setStateIfMounted } from "cuervo/src/utils/Functions";

let
    buttons = [],
    currentFocusedButton = null;

export function enableAllButtons(focusRef = null) {
    if(focusRef) {
        if(currentFocusedButton) {
            currentFocusedButton.focused = false;
            if(currentFocusedButton.props?.onBlur) {
                currentFocusedButton.props.onBlur();
            }
        }
        currentFocusedButton = focusRef;
        currentFocusedButton.focused = true;
        if(currentFocusedButton.props?.onFocus) {
            currentFocusedButton.props.onFocus();
        }
    }

    if(currentFocusedButton) {
        currentFocusedButton.enableButton(() => {
            buttons.map((button) => {
                if(button != currentFocusedButton) {
                    button.enableButton();
                }
            });
        });
    }
    else {
        buttons.map((button) => {
            button.enableButton();
        });
    }
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

        this.state = {
            enabled: this.props.accessible || true
        };
        this.focused = (this.state.enabled && (this.props?.focused || this.props?.hasTVPreferredFocus)) ? true : false;

        this.onLongPressed = false;
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler && !this.props?.nativeOnPress) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(this.state.enabled && this.focused && evt && evt.eventType == "select") {
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
            this.tvEventHandler = null;
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(this.focused && this.props?.onFocus) {
            this.props.onFocus();
            if(this.props?.specialButton) {
                currentFocusedButton= this;
            }
        }
        buttons.push(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
        const index = buttons.indexOf(this);
        if(index !== -1) {
            buttons.splice(index, 1);
        }
        this.disableTVEventHandler();
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    enableButton(callback = null) {
        if(!this.state.enabled) {
            setStateIfMounted(this, { enabled: true }, callback);
        }
    }

    disableButton() {
        if(this.state.enabled && this.props?.deactivable) {
            setStateIfMounted(this, { enabled: false });
        }
    }

    render () {
        const { children, ...rest } = this.props;
        return (
            <TouchableOpacity
                { ...rest }
                ref={ this.props.touchableRef }
                focusable={ this.state.enabled }
                accessible={ this.state.enabled }
                onPress={
                    () => {
                        if(this.state.enabled && this.props.nativeOnPress && this.props.onPress) {
                            this.props.onPress();
                        }
                    }
                }
                onFocus={
                    () => {
                        this.enableTVEventHandler();
                        if(this.state.enabled && !this.focused) {
                            this.focused = true;
                            if(this.props?.deactivable) {
                                currentFocusedButton = this;
                            }
                            if(this.props?.onFocus) {
                                this.props.onFocus();
                            }
                        }
                    }
                }
                onBlur={
                    () => {
                        this.disableTVEventHandler();
                        if(this.state.enabled && this.focused) {
                            this.focused = false;
                            if(this.props?.onBlur) {
                                this.props.onBlur();
                            }
                        }
                    }
                }
            >
                { children }
            </TouchableOpacity>
        );
    }
}