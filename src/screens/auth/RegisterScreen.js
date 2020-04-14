//Imports
import React from "react";
import { View, Text, TextInput } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard, { KeyboardTypes } from "cuervo/src/components/Keyboard";
import BoxTextInput from "cuervo/src/components/BoxTextInput";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default () => {
    var keyboard,
        textInputEmail;

    React.useEffect(() => {
        keyboard.setTextInput(textInputEmail);
    }, []);

    return (
        <View style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: Definitions.PRIMARY_COLOR
        }}>
            <View style={{ flex: 10 }}/>
            <View style={{ flex: 80 }}>
                
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    
                    <View style={{
                        flex: 25,
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        marginBottom: Definitions.DEFAULT_MARGIN
                    }}>
                        <Text style={ Styles.titleText }>Registrarse</Text>
                    </View>
                    <View style={{
                        flex: 50,
                        flexDirection: "row"
                    }}>
                        <View style={{
                            flex: 45,
                            flexDirection: "column"
                        }}>
                            <Keyboard 
                                ref={ component => keyboard = component }
                                keboardType={ KeyboardTypes.EMAIL }
                            />
                        </View>
                        <View style={{
                            flex: 55,
                            flexDirection: "column",
                            marginLeft: Definitions.DEFAULT_MARGIN
                        }}>
                            <BoxTextInput
                                ref={ component => textInputEmail = component }
                                placeholder={ "Escribe tu dirección de correo" }
                            />
                            <TextInput
                                style={[
                                    {
                                        borderRadius: 1,
                                        borderColor: "rgba(120, 120, 120, 0.2);",
                                        borderWidth: 1,
                                        padding: Definitions.DEFAULT_MARGIN / 2,
                                        paddingLeft: Definitions.DEFAULT_MARGIN,
                                        paddingRight: Definitions.DEFAULT_MARGIN,
                                        marginBottom: Definitions.DEFAULT_MARGIN
                                    },
                                    Styles.normalText
                                ]}
                                secureTextEntry={ true }
                                placeholder={"Escribe tu contraseña"}
                                placeholderTextColor={ "rgba(255, 255, 255, 0.4);" }
                            />
                            <TextInput
                                style={[
                                    {
                                        borderRadius: 1,
                                        borderColor: "rgba(120, 120, 120, 0.2);",
                                        borderWidth: 1,
                                        padding: Definitions.DEFAULT_MARGIN / 2,
                                        paddingLeft: Definitions.DEFAULT_MARGIN,
                                        paddingRight: Definitions.DEFAULT_MARGIN,
                                        marginBottom: Definitions.DEFAULT_MARGIN
                                    },
                                    Styles.normalText
                                ]}
                                secureTextEntry={ true }
                                placeholder={"Repite tu contraseña"}
                                placeholderTextColor={ "rgba(255, 255, 255, 0.4);" }
                            />
                        </View>
                    </View>
                    <View style={{ flex: 25 }}/>

                </View>
            </View>
            <View style={{ flex: 10 }}/>
        </View>
    );
}