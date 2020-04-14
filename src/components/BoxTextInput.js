//Imports
import React from "react";
import { TextInput } from "react-native";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class BoxButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: ""
        };
    }
    
    setFocus(focus) {
        this.setState({ focused: focus })
    }

    setText(value) {
        this.setState({ text: value })
    }

    render () {
        return (
            <TextInput
                style={[
                    {
                        borderRadius: 1,
                        borderWidth: 1,
                        padding: Definitions.DEFAULT_MARGIN / 2,
                        paddingLeft: Definitions.DEFAULT_MARGIN,
                        paddingRight: Definitions.DEFAULT_MARGIN,
                        marginBottom: Definitions.DEFAULT_MARGIN
                    },
                    Styles.normalText,
                    this.state.focused ? { borderColor: "rgba(255, 255, 255, 1.0);" } : { borderColor: "rgba(120, 120, 120, 0.2);" }
                ]}
                placeholderTextColor={ "rgba(255, 255, 255, 0.4);" }
                placeholder={ this.props.placeholder }
                secureTextEntry={ this.props.secureTextEntry }
                value= { this.state.text }
            />
        );
    }
}