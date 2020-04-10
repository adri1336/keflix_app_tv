//Imports
import React from "react";
import { Text, TouchableOpacity } from "react-native";

//Styles Imports
import Styles from "cuervo/src/styles/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

export default class NormalButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
    }
    
    render () {
        return (
            <TouchableOpacity
                hasTVPreferredFocus={ true }
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
                <Text style={
                    [
                        { color: Definitions.TEXT_COLOR },
                        Styles.normalText,
                        this.state.focused ? ( { fontWeight: "bold" } ) : ( { fontWeight: "normal" } )
                    ]
                }>{ this.props.children }</Text>
            </TouchableOpacity>
        )
    }
}