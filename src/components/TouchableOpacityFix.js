/*
    Por alguna razón el onPress de los componentes Touchables son llamados 3 veces
    en Android TV, le pasa a más gente: https://github.com/facebook/react-native/issues/27937
*/
//Imports
import React from "react";
import { TouchableOpacity, TVEventHandler } from "react-native";

//Code
export default class TouchableOpacityFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
        this.focused = this.props.focused ? this.props.focused : false;
        this.onLongPressCalled = false;
    }

    enableTVEventHandler() {
        if(this.tvEventHandler == null && this.props.onPress != null) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(this.focused) {
                    if(evt && evt.eventType == "select" && evt.eventKeyAction >= 0) {
                        if(evt.eventKeyAction == 0) {
                            this.props.onPress();
                            if(!this.onLongPressCalled && this.lastEventKeyAction == evt.eventKeyAction && this.props.onLongPress != null) {
                                this.onLongPressCalled = true;
                                this.props.onLongPress();
                            }
                        }
                        else {
                            this.onLongPressCalled = false;
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
        this._isMounted = true;
        this.enableTVEventHandler();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.disableTVEventHandler();
    }

    render () {
        return (
            <TouchableOpacity
                style={ this.props.style }
                hasTVPreferredFocus={ this.props.hasTVPreferredFocus }
                activeOpacity={ this.props.activeOpacity }
                onFocus={
                    () => {
                        if(this.props.onFocus != null) {
                            this.props.onFocus();
                        }
                        this.focused = true
                    }
                }
                onBlur={
                    () => {
                        if(this.props.onBlur != null) {
                            this.props.onBlur();
                        }
                        this.focused = false;
                    }
                }
            >{ this.props.children }</TouchableOpacity>
        );
    }
}