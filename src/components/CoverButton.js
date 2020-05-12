//Imports
import React from "react";
import { View,Image } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";
import { setStateIfMounted } from "cuervo/src/utils/Functions";

export default class CoverButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: this.props.hasTVPreferredFocus ? true : false
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

    render() {
        const { style } = this.props;
        return (
            <TouchableOpacityFix
                ref={ this.props.touchableFixRef }
                activeOpacity={ 1 }
                hasTVPreferredFocus={ this.props.hasTVPreferredFocus || false }
                deactivable={ true }
                onFocus={
                    () => {
                        if(this.props.onFocus) {
                            this.props.onFocus();
                        }
                        if(!this.state.focused) {
                            setStateIfMounted(this, { focused: true });
                        }
                    }
                }
                onBlur={
                    () => {
                        if(this.props.onBlur) {
                            this.props.onBlur();
                        }
                        if(this.state.focused) {
                            setStateIfMounted(this, { focused: false });
                        }
                    }
                }
                onPress={ this.props.onPress }
                style={[
                    style,
                    {
                        borderWidth: 2,
                        borderColor: this.state.focused ? "white" : "transparent"
                    }
                ]}
            >
                {
                    this.props.poster ? 
                        <Image
                            style={{ flex: 1, backgroundColor: "rgba(128, 128, 128, 0.2)" }}
                            source={{ uri: this.props.poster }}
                            resizeMethod="resize"
                        />
                    :
                        <View style={{ flex: 1, backgroundColor: "rgba(128, 128, 128, 0.2)" }}/>
                }
            </TouchableOpacityFix>
        );
    }
}