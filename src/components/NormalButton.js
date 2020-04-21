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
        if(this.props?.hasTVPreferredFocus) {
            this.state.focused = true;
        }
    }
    
    render () {
        const { children, ...rest } = this.props;
        return (
            <TouchableOpacityFix
                { ...rest }
                focused={ this.state.focused }
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
                        this.props.textStyle ? this.props.textStyle : Styles.normalText,
                        this.state.focused ? ( { fontWeight: "bold" } ) : ( { fontWeight: "normal" } )
                    ]
                }>{ children }</Text>
            </TouchableOpacityFix>
        );
    }
}