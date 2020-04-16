//Imports
import React from "react";
import { Text } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class NormalButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
        if(this.props.hasTVPreferredFocus) {
            this.state.focused = true;
        }
    }
    
    render () {
        return (
            <TouchableOpacityFix
                hasTVPreferredFocus={ this.props.hasTVPreferredFocus }
                onPress={ this.props.onPress }
                onTvLongPress={ this.props.onTvLongPress }
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
            </TouchableOpacityFix>
        );
    }
}