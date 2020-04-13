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
export default class BoxButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
    }
    
    render () {
        return (
            <TouchableOpacityFix
                style={[
                    this.props.style,
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
                        { padding: Definitions.DEFAULT_MARGIN },
                        this.state.focused ? ( { color: "white" } ) : ( { color: "rgba(255, 255, 255, 0.4);" } )
                    ]}>{ this.props.children }</Text>
            </TouchableOpacityFix>
        );
    }
}