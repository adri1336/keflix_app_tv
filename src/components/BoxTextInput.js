//Imports
import React from "react";
import { View, TextInput, Text } from "react-native";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { setStateIfMounted } from "cuervo/src/utils/Functions";

//Code
export default class BoxTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: this.props.text ?? "",
            errorText: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    setFocus(focus) {
        setStateIfMounted(this, { focused: focus });
    }

    setText(value) {
        var finalText = value;
        if(this.props.maxLength) {
            if(value.length > this.props.maxLength) {
                finalText = value.substring(0, this.props.maxLength);
            }
        }
        setStateIfMounted(this, {
            text: finalText,
            errorText: null
        });
        if(this.props.onTextSet) {
            this.props.onTextSet(finalText);
        }
    }

    setError(value) {
        setStateIfMounted(this, { errorText: value });
    }

    renderErrorMessage() {
        if(this.state.errorText != null) {
            return (
                <Text style={[
                    Styles.mediumText,
                    { color: "red" }
                ]}>{ this.state.errorText }</Text>
            );
        }
    }

    render () {
        const { ...rest } = this.props;
        return (
            <View style={{
                marginBottom: Definitions.DEFAULT_MARGIN
            }}>
                <TextInput
                    { ...rest }
                    style={[
                        {
                            borderRadius: 1,
                            borderWidth: 1,
                            padding: Definitions.DEFAULT_MARGIN / 2,
                            paddingLeft: Definitions.DEFAULT_MARGIN,
                            paddingRight: Definitions.DEFAULT_MARGIN
                        },
                        Styles.normalText,
                        this.state.focused ? { borderColor: "rgba(255, 255, 255, 1.0);" } : { borderColor: "rgba(120, 120, 120, 0.2);" }
                    ]}
                    placeholderTextColor={ "rgba(255, 255, 255, 0.4);" }
                    value={ this.state.text }
                />
                {
                    this.renderErrorMessage()
                }
            </View>
        );
    }
}