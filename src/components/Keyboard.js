//Imports
import React from "react";
import { View, Text } from "react-native";

//Components Imports
import BoxButton from "cuervo/src/components/BoxButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class Keyboard extends React.Component {
    constructor(props) {
        super(props);
        this.normalKeyboard = [
            ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
            ["|", "|", "z", "x", "c", "v", "b", "n", "m", "_"],
            ["@hotmail.com", "@gmail.com", "@hotmail.es"],
            ["!#$", "@", ".", ".com", "DEL"]
        ]
    }

    getKeyboard() {
        return (
            this.normalKeyboard.map((row, i) => {
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
                                return (
                                    <BoxButton
                                        key={ j }
                                        hasTVPreferredFocus={ (i == 0 && j == 0) ? ( true ) : ( false ) }
                                        style={[
                                            {
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            },
                                            j == 0 ? ( { marginLeft: 0 } ) : ( { marginLeft: Definitions.DEFAULT_MARGIN / 2 } )
                                        ]}
                                    >{ letter }</BoxButton>
                                );
                            })
                        }
                    </View>
                );
            })
        );
    }
    
    render () {
        return (
            <View style={{
                flex: 1,
                borderRadius: 1,
                backgroundColor: "rgba(120, 120, 120, 0.2);",
                padding: Definitions.DEFAULT_MARGIN
            }}>
                <View style={{
                    flex: 10,
                    flexDirection: "column"
                }}>
                    <Text style={ Styles.normalText }>Escribe tu dirección de correo</Text>
                </View>
                <View style={{
                    flex: 70,
                    flexDirection: "column"
                }}>
                    { this.getKeyboard() }
                </View>
                <View style={{
                    flex: 20,
                    flexDirection: "column"
                }}>
                    <View 
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "flex-end"
                    }}>
                        <BoxButton style={{ flex: 1, alignItems: "center" }}>Atrás</BoxButton>
                        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
                        <BoxButton style={{ flex: 2, alignItems: "center" }}>Siguiente</BoxButton>
                    </View>
                </View>
            </View>
        );
    }
}

/*
        <View style={{
                        flex: 1,
                        flexDirection: "row"
                    }}>
        <BoxButton style={{ flex: 1, alignItems: "center" }} hasTVPreferredFocus={ true }>1</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>2</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>3</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>4</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>5</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>6</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>7</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>8</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>9</BoxButton>
        <View style={{ width: Definitions.DEFAULT_MARGIN / 2 }}/>
        <BoxButton style={{ flex: 1, alignItems: "center" }}>0</BoxButton>
        */