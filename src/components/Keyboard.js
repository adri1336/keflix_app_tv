//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import BoxButton from "cuervo/src/components/BoxButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Vars
export const KeyboardTypes = {
    NORMAL: 0,
    EMAIL: 1
};

export const KeyboardButtonsTypes = {
    BACK: 0,
    NEXT: 1,
    CONTINUE: 2,
    FINISH: 3
};

const numericRow = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const lettersRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
    [["shift", 2.14], "z", "x", "c", "v", "b", "n", "m", "_"]
];
const specialRows = [
    ["`", "~", "!", "@", "#", "$", "%", "˄", "&", "*"],
    ["+", "-", "_", "{", "}", "|", "'", ".", "/", "?"],
    ["€", "(", ")", "\"", ":", ";", "¡", "¿", "=", "º"],
    [["abc", 1.56], ["shift", 1.56], "á", "é", "í", "ó", "ú", "ñ", "ç"]
];

const normalKeyboard = ["!#$", ["space", 2.06], ",", ".", "del"];
const emailKeyboard = [
    ["@hotmail.com", "@gmail.com", "@hotmail.es"],
    ["!#$", "@", ".", ".com", "del"]
];

//Code
function getKeyboard(type = KeyboardTypes.NORMAL, special = false) {
    var keyboard = [];
    keyboard.push(numericRow);

    if(special) {
        specialRows.map((row) => {
            keyboard.push(row);
        });
    }
    else {
        switch(type) {
            case KeyboardTypes.NORMAL: {
                lettersRows.map((row) => {
                    keyboard.push(row);
                });
                keyboard.push(normalKeyboard);
                break;
            }
            case KeyboardTypes.EMAIL: {
                lettersRows.map((row) => {
                    keyboard.push(row);
                });
                emailKeyboard.map((row) => {
                    keyboard.push(row);
                });
                break;
            }
        }
    }
    return keyboard;
}

function getButtonText(buttonType) {
    var buttonText;
    switch(buttonType) {
        case KeyboardButtonsTypes.BACK: {
            buttonText = i18n.t("keyboard.back");
            break;
        }
        case KeyboardButtonsTypes.NEXT: {
            buttonText = i18n.t("keyboard.next");
            break;
        }
        case KeyboardButtonsTypes.CONTINUE: {
            buttonText = i18n.t("keyboard.continue");
            break;
        }
        case KeyboardButtonsTypes.FINISH: {
            buttonText = i18n.t("keyboard.finish");
            break;
        }
    }
    return buttonText;
}

export default class Keyboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            capitalLetters: false,
            specialChars: false,
            title: null,
            buttonsType: this.props.buttonsType,
            keboardType: this.props.keboardType ? this.props.keboardType : KeyboardTypes.NORMAL
        };
        this.onButtonPress = this.props.onButtonPress;
        this.textInput = this.props.textInput;
        if(this.textInput) {
            this.state.title = this.textInput.props.placeholder;
        }
    }

    componentDidMount() {
        if(this.textInput) {
            this.textInput.setFocus(true);
        }
    }

    setKeyboardType(type) {
        this.setState({ keboardType: type });
    }
    
    renderKeyboard() {
        this.currentKeyboard = getKeyboard(this.state.keboardType, this.state.specialChars);
        return (
            this.currentKeyboard.map((row, i) => {
                return (
                    <View 
                        key={ i } 
                        style={[
                            {
                                flex: 1,
                                flexDirection: "row"
                            },
                            i == 0 ? ( { marginTop: 0 } ) : ( { marginTop: Definitions.DEFAULT_MARGIN / 2 } )
                        ]}
                    >
                        {
                            row.map((letter, j) => {
                                var stringLetter = Array.isArray(letter) ? letter[0] : letter;
                                const stringLetterUpper = stringLetter.toUpperCase();
                                if(this.state.capitalLetters) {
                                    stringLetter = stringLetterUpper;
                                }
                                
                                var iconObject, isDel = false;
                                switch(stringLetterUpper) {
                                    case "SHIFT": {
                                        if(this.state.capitalLetters) {
                                            iconObject = require("cuervo/assets/images/keyboard/caps_off.png");
                                        }
                                        else {
                                            iconObject = require("cuervo/assets/images/keyboard/caps_on.png");
                                        }
                                        break;
                                    }
                                    case "SPACE": {
                                        iconObject = require("cuervo/assets/images/keyboard/spacebar.png");
                                        break;
                                    }
                                    case "DEL": {
                                        isDel = true;
                                        iconObject = require("cuervo/assets/images/keyboard/backspace.png");
                                        break;
                                    }
                                }

                                return (
                                    <BoxButton
                                        key={ j }
                                        icon={ iconObject }
                                        onPress={ () => this.onKeyPressed(stringLetter) }
                                        onTvLongPress={
                                            isDel ? (
                                                () => {
                                                    if(this.textInput) {
                                                        this.textInput.setText("");
                                                    }
                                                }
                                            ) : ( null )
                                        }
                                        hasTVPreferredFocus={ (i == 0 && j == 0) ? ( true ) : ( false ) }
                                        style={[
                                            {
                                                justifyContent: "center",
                                                alignItems: "center"
                                            },
                                            Array.isArray(letter) ? { flex: letter[1] } : { flex: 1 },
                                            j == 0 ? ( { marginLeft: 0 } ) : ( { marginLeft: Definitions.DEFAULT_MARGIN / 2 } )
                                        ]}
                                    >{ 
                                        iconObject ? "" : stringLetter
                                    }</BoxButton>
                                )
                            })
                        }
                    </View>
                );
            })
        );
    }

    setTextInput(textInput) {
        if(this.textInput) {
            this.textInput.setFocus(false);
        }

        this.textInput = textInput;
        this.textInput.setFocus(true);
        this.setState({ title: this.textInput.props.placeholder });
    }

    onKeyPressed(letter) {
        switch(letter) {
            case "!#$": {
                this.setState({ specialChars: true });
                break;
            }
            case "abc":
            case "ABC": {
                this.setState({ specialChars: false });
                break;
            }
            case "shift":
            case "SHIFT": {
                this.setState({ capitalLetters: !this.state.capitalLetters });
                break;
            }
            case "space":
            case "SPACE": {
                this.textInput.setText(this.textInput.state.text + " ");
                break;
            }
            case "del":
            case "DEL": {
                this.textInput.setText(this.textInput.state.text.slice(0, -1));
                break;
            }
            default: {
                if(this.textInput) {
                    this.textInput.setText(this.textInput.state.text + letter);
                }
            }
        }
    }

    renderTitle() {
        if(this.state.title) {
            return (
                <View style={{
                    flex: 10,
                    flexDirection: "column"
                }}>
                    <Text style={ Styles.normalText }>
                        { this.state.title }
                    </Text>
                </View>
            );
        }
    }

    onButtonPressed(buttonType) {
        if(this.onButtonPress) {
            this.onButtonPress(this.textInput, buttonType);
        }
    }

    setButtons(buttons) {
        this.setState({ buttonsType: buttons });
    }

    renderButtons() {
        const buttons = this.state.buttonsType;
        if(buttons) {
            return (
                <View style={{
                    flex: 20,
                    flexDirection: "column"
                }}>
                    <View 
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "flex-end"
                        }}
                    >
                        {
                            buttons.map((button, i) => {
                                var buttonType = button, buttonFlex = 1;
                                if(Array.isArray(button)) {
                                    buttonType = button[0];
                                    buttonFlex = button[1];
                                }
                                
                                return(
                                    <BoxButton
                                        key={ i }
                                        style={[
                                            {
                                                flex: buttonFlex,
                                                alignItems: "center"
                                            },
                                            i == 0 ? { marginLeft: 0 } : { marginLeft: Definitions.DEFAULT_MARGIN / 2 }
                                        ]}
                                        onPress={ () => this.onButtonPressed(buttonType) }
                                    >
                                        {
                                            getButtonText(buttonType)
                                        }
                                    </BoxButton>
                                );
                            })
                        }
                    </View>
                </View>
            );
        }
    }
    
    render () {
        return (
            <View style={{
                flex: 1,
                borderRadius: 1,
                backgroundColor: "rgba(120, 120, 120, 0.2);",
                padding: Definitions.DEFAULT_MARGIN
            }}>
                {
                    this.renderTitle()
                }
                <View style={{
                    flex: 70,
                    flexDirection: "column"
                }}>
                    { this.renderKeyboard() }
                </View>
                {
                    this.renderButtons()
                }
            </View>
        );
    }
}