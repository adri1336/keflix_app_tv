//Imports
import React from "react";
import { Text, TouchableOpacity } from "react-native";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

export default class BoxButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
    }
    
    render () {
        return (
            <TouchableOpacity
                style={[
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
                }>
                <Text 
                    style={[
                        Styles.normalText,
                        { padding: 10 },
                        this.state.focused ? ( { color: "white" } ) : ( { color: "rgba(255, 255, 255, 0.4);" } )
                    ]}>{ this.props.children }</Text>
            </TouchableOpacity>
        )
    }
}