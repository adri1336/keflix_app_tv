//Imports
import React from "react";
import { View, Text } from "react-native";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class CodeTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: "",
            currentCodeIndex: 0
        };
        this.length = this.props?.length ? this.props.length : Definitions.PIN_PASSWORD_LENGTH;
        this.inputs = [];
        for(var i = 0; i < this.length; i ++) {
            this.inputs.push({
                text: ""
            });
        }
    }

    setFocus(focus) {
        this.setState({ focused: focus });
    }
    
    setText(value) {
        const currentIndex = this.state.currentCodeIndex;
        var newIndex = currentIndex;

        if(value == "") {
            if(this.inputs[currentIndex].text == "") {
                if(currentIndex > 0) {
                    newIndex = currentIndex - 1;
                }
            }
            else {
                this.inputs[currentIndex].text = "";
            }
        }
        else {
            this.inputs[currentIndex].text = value;
            if(currentIndex + 1 < this.length) {
                newIndex = currentIndex + 1;
            }
        }
        this.setState({ currentCodeIndex: newIndex });
    }

    getCode() {
        var code = "";
        for(var i = 0; i < this.length; i ++) {
            code += this.inputs[i].text;
        }
        return code;
    }

    renderTextInputs() {
        return (
            this.inputs.map((input, index) => {
                return (
                    <View
                        key={ index }
                        style={[
                            {
                                borderRadius: 1,
                                borderWidth: 1,
                                width: 50,
                                height: 50,
                                margin: Definitions.DEFAULT_MARGIN,
                                justifyContent: "center",
                                alignItems: "center"
                            },
                            (this.state.focused && this.state.currentCodeIndex == index) ? {
                                borderColor: "rgba(255, 255, 255, 1.0);"
                            } : {
                                borderColor: "rgba(120, 120, 120, 0.2);"
                            }
                        ]}
                    >
                        <Text style={ Styles.titleText }>
                            {
                                input.text != "" && this.props?.secureTextEntry ? "•" : input.text
                            }
                        </Text>
                    </View>
                );
            })
        );
    }

    render () {
        return (
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                { this.renderTextInputs() }
            </View>
        );
    }
}